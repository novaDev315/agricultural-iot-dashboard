import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrrigationSystem, IrrigationStatus } from '../../database/entities/irrigation-system.entity';
import { IrrigationSchedule } from '../../database/entities/irrigation-schedule.entity';
import { IrrigationEvent, IrrigationEventType, IrrigationEventStatus } from '../../database/entities/irrigation-event.entity';
import { FarmsService } from '../farms/farms.service';
import { MqttService } from '../mqtt/mqtt.service';
import { CreateIrrigationSystemDto, CreateScheduleDto, IrrigationCommandDto } from './dto/irrigation.dto';

@Injectable()
export class IrrigationService {
  constructor(
    @InjectRepository(IrrigationSystem)
    private systemsRepository: Repository<IrrigationSystem>,
    @InjectRepository(IrrigationSchedule)
    private schedulesRepository: Repository<IrrigationSchedule>,
    @InjectRepository(IrrigationEvent)
    private eventsRepository: Repository<IrrigationEvent>,
    private farmsService: FarmsService,
    @Inject(forwardRef(() => MqttService))
    private mqttService: MqttService,
  ) {}

  async createSystem(dto: CreateIrrigationSystemDto, userId: string): Promise<IrrigationSystem> {
    await this.farmsService.findOne(dto.farmId, userId);

    const system = this.systemsRepository.create(dto);
    return this.systemsRepository.save(system);
  }

  async findAllSystems(farmId: string, userId: string): Promise<IrrigationSystem[]> {
    await this.farmsService.findOne(farmId, userId);

    return this.systemsRepository.find({
      where: { farmId },
      relations: ['zone', 'schedules'],
      order: { name: 'ASC' },
    });
  }

  async findSystem(id: string, userId: string): Promise<IrrigationSystem> {
    const system = await this.systemsRepository.findOne({
      where: { id },
      relations: ['zone', 'schedules'],
    });

    if (!system) {
      throw new NotFoundException('Irrigation system not found');
    }

    await this.farmsService.findOne(system.farmId, userId);

    return system;
  }

  async startIrrigation(systemId: string, command: IrrigationCommandDto, userId: string): Promise<IrrigationEvent> {
    const system = await this.findSystem(systemId, userId);

    if (system.status === IrrigationStatus.RUNNING) {
      throw new BadRequestException('Irrigation is already running');
    }

    if (!system.enabled) {
      throw new BadRequestException('Irrigation system is disabled');
    }

    // Update system status
    system.status = IrrigationStatus.RUNNING;
    await this.systemsRepository.save(system);

    // Create event
    const event = this.eventsRepository.create({
      systemId,
      zoneId: system.zoneId,
      type: IrrigationEventType.MANUAL,
      status: IrrigationEventStatus.STARTED,
      startTime: new Date(),
      triggeredBy: userId,
      reason: command.reason || 'Manual start',
    });

    await this.eventsRepository.save(event);

    // Send MQTT command
    await this.mqttService.sendIrrigationCommand(system.farmId, systemId, 'start', {
      duration: command.duration || 30,
      valves: command.valves,
    });

    // Auto-stop after duration
    if (command.duration) {
      setTimeout(async () => {
        await this.stopIrrigation(systemId, userId, true);
      }, command.duration * 60 * 1000);
    }

    return event;
  }

  async stopIrrigation(systemId: string, userId: string, auto = false): Promise<IrrigationEvent | null> {
    const system = await this.systemsRepository.findOne({ where: { id: systemId } });

    if (!system) {
      return null;
    }

    if (system.status !== IrrigationStatus.RUNNING) {
      return null;
    }

    // Find active event
    const activeEvent = await this.eventsRepository.findOne({
      where: { systemId, status: IrrigationEventStatus.STARTED },
      order: { startTime: 'DESC' },
    });

    // Update system status
    const endTime = new Date();
    system.status = IrrigationStatus.IDLE;
    system.lastRunTime = activeEvent?.startTime;

    if (activeEvent) {
      const duration = Math.round((endTime.getTime() - activeEvent.startTime.getTime()) / 60000);
      system.lastRunDuration = duration;

      const waterUsed = duration * system.flowRatePerMinute;
      system.totalWaterUsed = Number(system.totalWaterUsed) + waterUsed;
      system.todayWaterUsed = Number(system.todayWaterUsed) + waterUsed;

      activeEvent.status = IrrigationEventStatus.COMPLETED;
      activeEvent.endTime = endTime;
      activeEvent.duration = duration;
      activeEvent.waterUsed = waterUsed;

      await this.eventsRepository.save(activeEvent);
    }

    await this.systemsRepository.save(system);

    // Send MQTT command
    await this.mqttService.sendIrrigationCommand(system.farmId, systemId, 'stop', {});

    return activeEvent;
  }

  async createSchedule(dto: CreateScheduleDto, userId: string): Promise<IrrigationSchedule> {
    const system = await this.findSystem(dto.systemId, userId);

    const schedule = this.schedulesRepository.create({
      ...dto,
      systemId: system.id,
    });

    return this.schedulesRepository.save(schedule);
  }

  async getSchedules(systemId: string, userId: string): Promise<IrrigationSchedule[]> {
    await this.findSystem(systemId, userId);

    return this.schedulesRepository.find({
      where: { systemId },
      order: { startTime: 'ASC' },
    });
  }

  async deleteSchedule(scheduleId: string, userId: string): Promise<void> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id: scheduleId },
      relations: ['system'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.farmsService.findOne(schedule.system.farmId, userId);
    await this.schedulesRepository.remove(schedule);
  }

  async getEvents(systemId: string, userId: string, limit = 20): Promise<IrrigationEvent[]> {
    await this.findSystem(systemId, userId);

    return this.eventsRepository.find({
      where: { systemId },
      order: { startTime: 'DESC' },
      take: limit,
    });
  }

  async getWaterUsageStats(farmId: string, userId: string) {
    await this.farmsService.findOne(farmId, userId);

    const systems = await this.systemsRepository.find({ where: { farmId } });

    const totalWaterUsed = systems.reduce((sum, s) => sum + Number(s.totalWaterUsed), 0);
    const todayWaterUsed = systems.reduce((sum, s) => sum + Number(s.todayWaterUsed), 0);

    return {
      totalWaterUsed,
      todayWaterUsed,
      systemsCount: systems.length,
      activeCount: systems.filter((s) => s.status === IrrigationStatus.RUNNING).length,
      byZone: systems.map((s) => ({
        systemId: s.id,
        systemName: s.name,
        zoneId: s.zoneId,
        totalWaterUsed: Number(s.totalWaterUsed),
        todayWaterUsed: Number(s.todayWaterUsed),
      })),
    };
  }
}
