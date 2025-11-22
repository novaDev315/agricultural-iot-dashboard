import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Zone } from './zone.entity';
import { Device } from './device.entity';
import { Alert } from './alert.entity';
import { AutomationRule } from './automation-rule.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: 'area_acres', type: 'decimal', precision: 10, scale: 2 })
  areaAcres: number;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.farms)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Zone, (zone) => zone.farm)
  zones: Zone[];

  @OneToMany(() => Device, (device) => device.farm)
  devices: Device[];

  @OneToMany(() => Alert, (alert) => alert.farm)
  alerts: Alert[];

  @OneToMany(() => AutomationRule, (rule) => rule.farm)
  automationRules: AutomationRule[];
}
