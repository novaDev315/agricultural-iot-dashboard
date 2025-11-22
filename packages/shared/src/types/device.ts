import { SensorType } from './sensor';

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

export interface Device {
  id: string;
  farmId: string;
  zoneId?: string;
  deviceId: string; // Hardware ID
  name: string;
  description?: string;
  type: DeviceType;
  status: DeviceStatus;
  connectionType: ConnectionType;
  firmwareVersion?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  batteryLevel?: number;
  signalStrength?: number;
  lastSeen?: Date;
  sensors?: DeviceSensor[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceSensor {
  id: string;
  type: SensorType;
  name: string;
  enabled: boolean;
  calibrationOffset?: number;
  lastReading?: number;
  lastReadingTime?: Date;
}

export interface DeviceCommand {
  id: string;
  deviceId: string;
  command: string;
  payload?: Record<string, unknown>;
  status: 'pending' | 'sent' | 'acknowledged' | 'executed' | 'failed';
  sentAt?: Date;
  acknowledgedAt?: Date;
  executedAt?: Date;
  response?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
}

export interface DeviceHealth {
  deviceId: string;
  status: DeviceStatus;
  batteryLevel?: number;
  signalStrength?: number;
  uptime?: number; // in seconds
  freeMemory?: number; // in bytes
  cpuUsage?: number; // percentage
  temperature?: number; // device temperature
  lastHealthCheck: Date;
  issues: DeviceIssue[];
}

export interface DeviceIssue {
  type: 'low_battery' | 'weak_signal' | 'high_temperature' | 'memory_low' | 'sensor_error' | 'connection_lost';
  severity: 'warning' | 'critical';
  message: string;
  detectedAt: Date;
}

export interface RegisterDeviceDto {
  farmId: string;
  zoneId?: string;
  deviceId: string;
  name: string;
  description?: string;
  type: DeviceType;
  connectionType: ConnectionType;
  location?: {
    latitude: number;
    longitude: number;
  };
  sensors?: {
    type: SensorType;
    name: string;
  }[];
}

export interface DeviceTelemetry {
  deviceId: string;
  timestamp: Date;
  batteryLevel?: number;
  signalStrength?: number;
  uptime?: number;
  freeMemory?: number;
  temperature?: number;
}
