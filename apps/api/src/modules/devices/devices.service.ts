import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceStatus } from '../../database/entities/device.entity';
import { FarmsService } from '../farms/farms.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    private farmsService: FarmsService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto, userId: string): Promise<Device> {
    await this.farmsService.findOne(createDeviceDto.farmId, userId);

    const existingDevice = await this.devicesRepository.findOne({
      where: { deviceId: createDeviceDto.deviceId },
    });

    if (existingDevice) {
      throw new ConflictException('Device ID already registered');
    }

    const device = this.devicesRepository.create(createDeviceDto);
    return this.devicesRepository.save(device);
  }

  async findAllByFarm(farmId: string, userId: string): Promise<Device[]> {
    await this.farmsService.findOne(farmId, userId);

    return this.devicesRepository.find({
      where: { farmId },
      relations: ['zone'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Device> {
    const device = await this.devicesRepository.findOne({
      where: { id },
      relations: ['farm', 'zone'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    await this.farmsService.findOne(device.farmId, userId);

    return device;
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.devicesRepository.findOne({
      where: { deviceId },
      relations: ['farm', 'zone'],
    });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto, userId: string): Promise<Device> {
    const device = await this.findOne(id, userId);
    Object.assign(device, updateDeviceDto);
    return this.devicesRepository.save(device);
  }

  async updateStatus(deviceId: string, status: DeviceStatus, additionalData?: Partial<Device>): Promise<Device | null> {
    const device = await this.devicesRepository.findOne({
      where: { deviceId },
    });

    if (!device) {
      return null;
    }

    device.status = status;
    device.lastSeen = new Date();

    if (additionalData) {
      Object.assign(device, additionalData);
    }

    return this.devicesRepository.save(device);
  }

  async remove(id: string, userId: string): Promise<void> {
    const device = await this.findOne(id, userId);
    await this.devicesRepository.remove(device);
  }

  async getDeviceStats(farmId: string, userId: string) {
    await this.farmsService.findOne(farmId, userId);

    const devices = await this.devicesRepository.find({
      where: { farmId },
    });

    const stats = {
      total: devices.length,
      online: devices.filter((d) => d.status === DeviceStatus.ONLINE).length,
      offline: devices.filter((d) => d.status === DeviceStatus.OFFLINE).length,
      error: devices.filter((d) => d.status === DeviceStatus.ERROR).length,
      lowBattery: devices.filter((d) => d.batteryLevel !== null && d.batteryLevel < 20).length,
      byType: {} as Record<string, number>,
    };

    devices.forEach((device) => {
      stats.byType[device.type] = (stats.byType[device.type] || 0) + 1;
    });

    return stats;
  }
}
