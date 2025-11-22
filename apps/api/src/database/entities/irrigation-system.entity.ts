import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Zone } from './zone.entity';
import { IrrigationSchedule } from './irrigation-schedule.entity';
import { IrrigationEvent } from './irrigation-event.entity';

export enum IrrigationStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SCHEDULED = 'scheduled',
  PAUSED = 'paused',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

export enum IrrigationType {
  DRIP = 'drip',
  SPRINKLER = 'sprinkler',
  FLOOD = 'flood',
  CENTER_PIVOT = 'center_pivot',
  SUBSURFACE = 'subsurface',
}

@Entity('irrigation_systems')
export class IrrigationSystem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column({ name: 'zone_id' })
  zoneId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column({ type: 'enum', enum: IrrigationType })
  type: IrrigationType;

  @Column({ type: 'enum', enum: IrrigationStatus, default: IrrigationStatus.IDLE })
  status: IrrigationStatus;

  @Column({ name: 'valve_count', default: 1 })
  valveCount: number;

  @Column({ name: 'flow_rate_per_minute', type: 'decimal', precision: 10, scale: 2 })
  flowRatePerMinute: number;

  @Column({ name: 'max_duration', default: 120 })
  maxDuration: number;

  @Column({ name: 'total_water_used', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalWaterUsed: number;

  @Column({ name: 'today_water_used', type: 'decimal', precision: 12, scale: 2, default: 0 })
  todayWaterUsed: number;

  @Column({ name: 'last_run_time', nullable: true })
  lastRunTime?: Date;

  @Column({ name: 'last_run_duration', nullable: true })
  lastRunDuration?: number;

  @Column({ name: 'next_scheduled_run', nullable: true })
  nextScheduledRun?: Date;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'smart_config' })
  smartConfig?: {
    enabled: boolean;
    soilMoistureThreshold: { min: number; max: number };
    temperatureAdjustment: boolean;
    rainSkipEnabled: boolean;
    rainSkipThreshold: number;
    windSpeedLimit: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @OneToOne(() => Zone, (zone) => zone.irrigationSystem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @OneToMany(() => IrrigationSchedule, (schedule) => schedule.system)
  schedules: IrrigationSchedule[];

  @OneToMany(() => IrrigationEvent, (event) => event.system)
  events: IrrigationEvent[];
}
