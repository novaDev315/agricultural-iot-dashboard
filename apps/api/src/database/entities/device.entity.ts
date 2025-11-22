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
import { Zone } from './zone.entity';

export enum DeviceType {
  SENSOR_NODE = 'sensor_node',
  IRRIGATION_CONTROLLER = 'irrigation_controller',
  WEATHER_STATION = 'weather_station',
  GATEWAY = 'gateway',
  CAMERA = 'camera',
  ACTUATOR = 'actuator',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  INITIALIZING = 'initializing',
}

export enum ConnectionType {
  WIFI = 'wifi',
  LORA = 'lora',
  ZIGBEE = 'zigbee',
  CELLULAR = 'cellular',
  ETHERNET = 'ethernet',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId?: string;

  @Column({ name: 'device_id', unique: true })
  deviceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: DeviceType })
  type: DeviceType;

  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.INITIALIZING })
  status: DeviceStatus;

  @Column({ name: 'connection_type', type: 'enum', enum: ConnectionType })
  connectionType: ConnectionType;

  @Column({ name: 'firmware_version', nullable: true })
  firmwareVersion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ name: 'battery_level', nullable: true })
  batteryLevel?: number;

  @Column({ name: 'signal_strength', nullable: true })
  signalStrength?: number;

  @Column({ name: 'last_seen', nullable: true })
  lastSeen?: Date;

  @Column({ type: 'jsonb', nullable: true })
  sensors?: {
    id: string;
    type: string;
    name: string;
    enabled: boolean;
    calibrationOffset?: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Farm, (farm) => farm.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @ManyToOne(() => Zone, (zone) => zone.devices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'zone_id' })
  zone?: Zone;
}
