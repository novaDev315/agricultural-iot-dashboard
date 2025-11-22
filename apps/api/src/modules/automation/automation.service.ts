import { Injectable, NotFoundException, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AutomationRule, AutomationStatus } from '../../database/entities/automation-rule.entity';
import { FarmsService } from '../farms/farms.service';
import { IrrigationService } from '../irrigation/irrigation.service';
import { SensorsService } from '../sensors/sensors.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectRepository(AutomationRule)
    private rulesRepository: Repository<AutomationRule>,
    private farmsService: FarmsService,
    @Inject(forwardRef(() => IrrigationService))
    private irrigationService: IrrigationService,
    private sensorsService: SensorsService,
    @Inject(forwardRef(() => WebsocketGateway))
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(dto: CreateAutomationRuleDto, userId: string): Promise<AutomationRule> {
    await this.farmsService.findOne(dto.farmId, userId);

    const rule = this.rulesRepository.create({
      ...dto,
      triggers: dto.triggers.map((t, i) => ({ ...t, id: `trigger-${i}` })),
      conditions: dto.conditions?.map((c, i) => ({ ...c, id: `condition-${i}` })),
      actions: dto.actions.map((a, i) => ({ ...a, id: `action-${i}`, order: i })),
    });

    return this.rulesRepository.save(rule);
  }

  async findAllByFarm(farmId: string, userId: string): Promise<AutomationRule[]> {
    await this.farmsService.findOne(farmId, userId);

    return this.rulesRepository.find({
      where: { farmId },
      order: { priority: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<AutomationRule> {
    const rule = await this.rulesRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Automation rule not found');
    }

    await this.farmsService.findOne(rule.farmId, userId);

    return rule;
  }

  async update(id: string, dto: UpdateAutomationRuleDto, userId: string): Promise<AutomationRule> {
    const rule = await this.findOne(id, userId);

    Object.assign(rule, dto);

    return this.rulesRepository.save(rule);
  }

  async remove(id: string, userId: string): Promise<void> {
    const rule = await this.findOne(id, userId);
    await this.rulesRepository.remove(rule);
  }

  async toggleRule(id: string, userId: string): Promise<AutomationRule> {
    const rule = await this.findOne(id, userId);

    rule.status = rule.status === AutomationStatus.ENABLED
      ? AutomationStatus.DISABLED
      : AutomationStatus.ENABLED;

    return this.rulesRepository.save(rule);
  }

  // Evaluate and execute automation rules
  async evaluateSensorTriggers(farmId: string, deviceId: string, sensorType: string, value: number) {
    const rules = await this.rulesRepository.find({
      where: { farmId, status: AutomationStatus.ENABLED },
    });

    for (const rule of rules) {
      try {
        const triggered = await this.checkTriggers(rule, sensorType, value);

        if (triggered && this.canExecute(rule)) {
          await this.executeRule(rule, { sensorType, value, deviceId });
        }
      } catch (error) {
        this.logger.error(`Error evaluating rule ${rule.id}: ${error}`);
      }
    }
  }

  private async checkTriggers(rule: AutomationRule, sensorType: string, value: number): Promise<boolean> {
    const sensorTriggers = rule.triggers.filter((t) => t.type === 'sensor_value');

    if (sensorTriggers.length === 0) {
      return false;
    }

    const results = sensorTriggers.map((trigger) => {
      const config = trigger.config as { sensorType: string; operator: string; value: number; maxValue?: number };

      if (config.sensorType !== sensorType) {
        return false;
      }

      switch (config.operator) {
        case 'gt':
          return value > config.value;
        case 'lt':
          return value < config.value;
        case 'gte':
          return value >= config.value;
        case 'lte':
          return value <= config.value;
        case 'eq':
          return value === config.value;
        case 'between':
          return value >= config.value && value <= (config.maxValue || config.value);
        default:
          return false;
      }
    });

    if (rule.triggerLogic === 'and') {
      return results.every((r) => r);
    } else {
      return results.some((r) => r);
    }
  }

  private canExecute(rule: AutomationRule): boolean {
    // Check cooldown
    if (rule.lastTriggered) {
      const cooldownMs = rule.cooldownMinutes * 60 * 1000;
      if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
        return false;
      }
    }

    // Check max executions per day
    if (rule.maxExecutionsPerDay && rule.executionCount >= rule.maxExecutionsPerDay) {
      const lastTriggeredDate = rule.lastTriggered?.toDateString();
      const todayDate = new Date().toDateString();
      if (lastTriggeredDate === todayDate) {
        return false;
      }
    }

    return true;
  }

  private async executeRule(rule: AutomationRule, triggerData: Record<string, unknown>) {
    this.logger.log(`Executing automation rule: ${rule.name}`);

    for (const action of rule.actions.sort((a, b) => a.order - b.order)) {
      try {
        await this.executeAction(rule.farmId, action);
      } catch (error) {
        this.logger.error(`Failed to execute action ${action.id}: ${error}`);
      }
    }

    // Update rule execution stats
    rule.lastTriggered = new Date();
    rule.executionCount += 1;
    await this.rulesRepository.save(rule);

    // Broadcast event
    this.websocketGateway.broadcastAutomationEvent(rule.farmId, {
      ruleId: rule.id,
      ruleName: rule.name,
      triggerData,
      executedAt: new Date(),
    });
  }

  private async executeAction(farmId: string, action: AutomationRule['actions'][0]) {
    const config = action.config as Record<string, unknown>;

    switch (action.type) {
      case 'irrigation_start':
        // Would call irrigation service in production
        this.logger.log(`Starting irrigation: ${config.systemId}`);
        break;

      case 'irrigation_stop':
        this.logger.log(`Stopping irrigation: ${config.systemId}`);
        break;

      case 'send_notification':
        this.logger.log(`Sending notification: ${config.template}`);
        break;

      case 'log_event':
        this.logger.log(`Logging event: ${config.message}`);
        break;

      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
    }
  }

  // Reset daily execution counts
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailyExecutionCounts() {
    await this.rulesRepository.update({}, { executionCount: 0 });
    this.logger.log('Reset daily automation execution counts');
  }
}
