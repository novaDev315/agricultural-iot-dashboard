import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Device } from './device.entity';
import { IrrigationSystem } from './irrigation-system.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  polygon?: { coordinates: { latitude: number; longitude: number }[] };

  @Column({ name: 'area_acres', type: 'decimal', precision: 10, scale: 2 })
  areaAcres: number;

  @Column({ name: 'crop_type', nullable: true })
  cropType?: string;

  @Column({ name: 'soil_type', nullable: true })
  soilType?: string;

  @Column({ name: 'planting_date', nullable: true })
  plantingDate?: Date;

  @Column({ name: 'expected_harvest_date', nullable: true })
  expectedHarvestDate?: Date;

  @Column({ nullable: true })
  color?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, (farm) => farm.zones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @OneToMany(() => Device, (device) => device.zone)
  devices: Device[];

  @OneToOne(() => IrrigationSystem, (system) => system.zone)
  irrigationSystem?: IrrigationSystem;
}
