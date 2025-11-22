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
import { AlertSeverity } from './alert.entity';

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'jsonb' })
  conditions: {
    id: string;
    type: 'sensor' | 'device' | 'weather' | 'time';
    sensorType?: string;
    deviceId?: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between' | 'outside';
    value: number;
    maxValue?: number;
    duration?: number;
  }[];

  @Column({ name: 'condition_logic', default: 'and' })
  conditionLogic: 'and' | 'or';

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ name: 'cooldown_minutes', default: 30 })
  cooldownMinutes: number;

  @Column({ type: 'jsonb' })
  notifications: {
    channel: 'email' | 'sms' | 'push' | 'slack' | 'webhook';
    recipients: string[];
    template?: string;
    enabled: boolean;
  }[];

  @Column({ name: 'last_triggered', nullable: true })
  lastTriggered?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
