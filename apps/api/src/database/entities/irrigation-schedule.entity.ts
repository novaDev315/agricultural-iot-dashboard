import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IrrigationSystem } from './irrigation-system.entity';

@Entity('irrigation_schedules')
export class IrrigationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'system_id' })
  systemId: string;

  @Column()
  name: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ name: 'start_time' })
  startTime: string; // HH:mm format

  @Column()
  duration: number; // minutes

  @Column({ name: 'days_of_week', type: 'simple-array' })
  daysOfWeek: number[]; // 0-6, Sunday = 0

  @Column({ name: 'start_date', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate?: Date;

  @Column({ name: 'skip_weather', default: true })
  skipWeather: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IrrigationSystem, (system) => system.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'system_id' })
  system: IrrigationSystem;
}
