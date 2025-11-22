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

export enum AutomationStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  PAUSED = 'paused',
}

@Entity('automation_rules')
export class AutomationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: AutomationStatus, default: AutomationStatus.ENABLED })
  status: AutomationStatus;

  @Column({ default: 0 })
  priority: number;

  @Column({ type: 'jsonb' })
  triggers: {
    id: string;
    type: 'sensor_value' | 'time_schedule' | 'weather_condition' | 'device_status' | 'manual';
    config: Record<string, unknown>;
  }[];

  @Column({ name: 'trigger_logic', default: 'and' })
  triggerLogic: 'and' | 'or';

  @Column({ type: 'jsonb', nullable: true })
  conditions?: {
    id: string;
    type: 'time_window' | 'sensor_check' | 'weather_check' | 'flag';
    config: Record<string, unknown>;
  }[];

  @Column({ type: 'jsonb' })
  actions: {
    id: string;
    type: 'irrigation_start' | 'irrigation_stop' | 'send_notification' | 'device_command' | 'webhook_call' | 'log_event';
    config: Record<string, unknown>;
    delay?: number;
    order: number;
  }[];

  @Column({ name: 'cooldown_minutes', default: 30 })
  cooldownMinutes: number;

  @Column({ name: 'max_executions_per_day', nullable: true })
  maxExecutionsPerDay?: number;

  @Column({ name: 'execution_count', default: 0 })
  executionCount: number;

  @Column({ name: 'last_triggered', nullable: true })
  lastTriggered?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, (farm) => farm.automationRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
