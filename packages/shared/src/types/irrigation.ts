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

export interface IrrigationSystem {
  id: string;
  farmId: string;
  zoneId: string;
  name: string;
  description?: string;
  deviceId: string;
  type: IrrigationType;
  status: IrrigationStatus;
  valveCount: number;
  flowRatePerMinute: number; // Liters per minute
  maxDuration: number; // Maximum run time in minutes
  totalWaterUsed: number; // Total liters used
  todayWaterUsed: number;
  lastRunTime?: Date;
  lastRunDuration?: number; // in minutes
  nextScheduledRun?: Date;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IrrigationZoneValve {
  id: string;
  systemId: string;
  valveNumber: number;
  name: string;
  status: 'open' | 'closed' | 'error';
  flowRate: number;
  lastOpened?: Date;
  lastClosed?: Date;
}

export interface IrrigationSchedule {
  id: string;
  systemId: string;
  name: string;
  enabled: boolean;
  startTime: string; // HH:mm format
  duration: number; // minutes
  daysOfWeek: number[]; // 0-6, Sunday = 0
  startDate?: Date;
  endDate?: Date;
  skipWeather: boolean; // Skip if rain forecasted
  createdAt: Date;
  updatedAt: Date;
}

export interface IrrigationEvent {
  id: string;
  systemId: string;
  zoneId: string;
  type: 'manual' | 'scheduled' | 'automated' | 'emergency_stop';
  status: 'started' | 'completed' | 'cancelled' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  waterUsed?: number; // liters
  triggeredBy?: string; // user ID or automation rule ID
  reason?: string;
  weatherConditions?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
}

export interface IrrigationCommand {
  systemId: string;
  command: 'start' | 'stop' | 'pause' | 'resume';
  duration?: number; // minutes, for start command
  valves?: number[]; // specific valves to control
  reason?: string;
}

export interface IrrigationStats {
  systemId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalWaterUsed: number;
  totalRunTime: number; // minutes
  runCount: number;
  avgRunDuration: number;
  avgWaterPerRun: number;
  savings?: number; // estimated water savings
  startDate: Date;
  endDate: Date;
}

export interface SmartIrrigationConfig {
  systemId: string;
  enabled: boolean;
  soilMoistureThreshold: {
    min: number; // Start irrigation when below
    max: number; // Stop irrigation when reached
  };
  temperatureAdjustment: boolean;
  rainSkipEnabled: boolean;
  rainSkipThreshold: number; // mm of rain to skip
  windSpeedLimit: number; // m/s - don't irrigate above this
  timeRestrictions?: {
    noIrrigationStart: string; // HH:mm
    noIrrigationEnd: string; // HH:mm
  };
}

export interface CreateIrrigationSystemDto {
  farmId: string;
  zoneId: string;
  name: string;
  description?: string;
  deviceId: string;
  type: IrrigationType;
  valveCount: number;
  flowRatePerMinute: number;
  maxDuration: number;
}

export interface CreateIrrigationScheduleDto {
  systemId: string;
  name: string;
  startTime: string;
  duration: number;
  daysOfWeek: number[];
  skipWeather?: boolean;
}
