import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertSeverity, AlertType, AlertStatus } from '../../database/entities/alert.entity';
import { AlertRule } from '../../database/entities/alert-rule.entity';
import { FarmsService } from '../farms/farms.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateAlertDto, CreateAlertRuleDto, UpdateAlertDto } from './dto/alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(AlertRule)
    private rulesRepository: Repository<AlertRule>,
    private farmsService: FarmsService,
    @Inject(forwardRef(() => WebsocketGateway))
    private websocketGateway: WebsocketGateway,
  ) {}

  async createAlert(dto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertsRepository.create(dto);
    const savedAlert = await this.alertsRepository.save(alert);

    // Broadcast to WebSocket
    this.websocketGateway.broadcastAlert(dto.farmId, {
      id: savedAlert.id,
      type: savedAlert.type,
      severity: savedAlert.severity,
      title: savedAlert.title,
      message: savedAlert.message,
      createdAt: savedAlert.createdAt,
    });

    return savedAlert;
  }

  async findAllByFarm(farmId: string, userId: string, status?: AlertStatus): Promise<Alert[]> {
    await this.farmsService.findOne(farmId, userId);

    const where: Record<string, unknown> = { farmId };
    if (status) {
      where.status = status;
    }

    return this.alertsRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findOne(id: string, userId: string): Promise<Alert> {
    const alert = await this.alertsRepository.findOne({ where: { id } });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await this.farmsService.findOne(alert.farmId, userId);

    return alert;
  }

  async acknowledgeAlert(id: string, userId: string): Promise<Alert> {
    const alert = await this.findOne(id, userId);

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    return this.alertsRepository.save(alert);
  }

  async resolveAlert(id: string, userId: string): Promise<Alert> {
    const alert = await this.findOne(id, userId);

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();

    return this.alertsRepository.save(alert);
  }

  async snoozeAlert(id: string, userId: string, minutes: number): Promise<Alert> {
    const alert = await this.findOne(id, userId);

    alert.status = AlertStatus.SNOOZED;
    alert.snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);

    return this.alertsRepository.save(alert);
  }

  async getAlertStats(farmId: string, userId: string) {
    await this.farmsService.findOne(farmId, userId);

    const alerts = await this.alertsRepository.find({ where: { farmId } });

    const stats = {
      total: alerts.length,
      active: alerts.filter((a) => a.status === AlertStatus.ACTIVE).length,
      acknowledged: alerts.filter((a) => a.status === AlertStatus.ACKNOWLEDGED).length,
      resolved: alerts.filter((a) => a.status === AlertStatus.RESOLVED).length,
      bySeverity: {
        info: alerts.filter((a) => a.severity === AlertSeverity.INFO && a.status === AlertStatus.ACTIVE).length,
        warning: alerts.filter((a) => a.severity === AlertSeverity.WARNING && a.status === AlertStatus.ACTIVE).length,
        critical: alerts.filter((a) => a.severity === AlertSeverity.CRITICAL && a.status === AlertStatus.ACTIVE).length,
        emergency: alerts.filter((a) => a.severity === AlertSeverity.EMERGENCY && a.status === AlertStatus.ACTIVE).length,
      },
    };

    return stats;
  }

  // Alert Rules
  async createRule(dto: CreateAlertRuleDto, userId: string): Promise<AlertRule> {
    await this.farmsService.findOne(dto.farmId, userId);

    const rule = this.rulesRepository.create(dto);
    return this.rulesRepository.save(rule);
  }

  async findRulesByFarm(farmId: string, userId: string): Promise<AlertRule[]> {
    await this.farmsService.findOne(farmId, userId);

    return this.rulesRepository.find({
      where: { farmId },
      order: { name: 'ASC' },
    });
  }

  async deleteRule(id: string, userId: string): Promise<void> {
    const rule = await this.rulesRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Alert rule not found');
    }

    await this.farmsService.findOne(rule.farmId, userId);
    await this.rulesRepository.remove(rule);
  }

  // Check sensor value against rules
  async checkSensorRules(farmId: string, sensorType: string, value: number) {
    const rules = await this.rulesRepository.find({
      where: { farmId, enabled: true },
    });

    for (const rule of rules) {
      const matchingConditions = rule.conditions.filter(
        (c) => c.type === 'sensor' && c.sensorType === sensorType,
      );

      for (const condition of matchingConditions) {
        let triggered = false;

        switch (condition.operator) {
          case 'gt':
            triggered = value > condition.value;
            break;
          case 'lt':
            triggered = value < condition.value;
            break;
          case 'gte':
            triggered = value >= condition.value;
            break;
          case 'lte':
            triggered = value <= condition.value;
            break;
          case 'eq':
            triggered = value === condition.value;
            break;
        }

        if (triggered) {
          await this.createAlert({
            farmId,
            type: AlertType.SENSOR_THRESHOLD,
            severity: rule.severity,
            title: rule.name,
            message: `${sensorType} value ${value} triggered rule: ${rule.name}`,
            data: { sensorType, value, ruleId: rule.id },
          });

          rule.lastTriggered = new Date();
          await this.rulesRepository.save(rule);
        }
      }
    }
  }
}
