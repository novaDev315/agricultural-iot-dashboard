import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IrrigationSystem } from './irrigation-system.entity';

export enum IrrigationEventType {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  AUTOMATED = 'automated',
  EMERGENCY_STOP = 'emergency_stop',
}

export enum IrrigationEventStatus {
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('irrigation_events')
export class IrrigationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'system_id' })
  systemId: string;

  @Column({ name: 'zone_id' })
  zoneId: string;

  @Column({ type: 'enum', enum: IrrigationEventType })
  type: IrrigationEventType;

  @Column({ type: 'enum', enum: IrrigationEventStatus })
  status: IrrigationEventStatus;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime?: Date;

  @Column({ nullable: true })
  duration?: number; // minutes

  @Column({ name: 'water_used', type: 'decimal', precision: 10, scale: 2, nullable: true })
  waterUsed?: number; // liters

  @Column({ name: 'triggered_by', nullable: true })
  triggeredBy?: string; // user ID or automation rule ID

  @Column({ nullable: true })
  reason?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'weather_conditions' })
  weatherConditions?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => IrrigationSystem, (system) => system.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'system_id' })
  system: IrrigationSystem;
}
