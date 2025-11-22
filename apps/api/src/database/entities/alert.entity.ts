import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
}

export enum AlertType {
  SENSOR_THRESHOLD = 'sensor_threshold',
  DEVICE_OFFLINE = 'device_offline',
  LOW_BATTERY = 'low_battery',
  IRRIGATION_FAILED = 'irrigation_failed',
  WEATHER_ALERT = 'weather_alert',
  PEST_DETECTION = 'pest_detection',
  DISEASE_RISK = 'disease_risk',
  FROST_WARNING = 'frost_warning',
  SYSTEM_ERROR = 'system_error',
  AUTOMATION_TRIGGERED = 'automation_triggered',
  WATER_LEAK = 'water_leak',
  SCHEDULED_MAINTENANCE = 'scheduled_maintenance',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SNOOZED = 'snoozed',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId?: string;

  @Column({ name: 'device_id', nullable: true })
  deviceId?: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE })
  status: AlertStatus;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ name: 'acknowledged_by', nullable: true })
  acknowledgedBy?: string;

  @Column({ name: 'acknowledged_at', nullable: true })
  acknowledgedAt?: Date;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt?: Date;

  @Column({ name: 'snoozed_until', nullable: true })
  snoozedUntil?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, (farm) => farm.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
