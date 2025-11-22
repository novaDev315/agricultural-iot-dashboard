export enum SensorType {
  SOIL_MOISTURE = 'soil_moisture',
  SOIL_TEMPERATURE = 'soil_temperature',
  SOIL_PH = 'soil_ph',
  SOIL_EC = 'soil_ec', // Electrical Conductivity
  AIR_TEMPERATURE = 'air_temperature',
  AIR_HUMIDITY = 'air_humidity',
  LIGHT_INTENSITY = 'light_intensity',
  UV_INDEX = 'uv_index',
  WIND_SPEED = 'wind_speed',
  WIND_DIRECTION = 'wind_direction',
  RAINFALL = 'rainfall',
  ATMOSPHERIC_PRESSURE = 'atmospheric_pressure',
  CO2_LEVEL = 'co2_level',
  LEAF_WETNESS = 'leaf_wetness',
  WATER_LEVEL = 'water_level',
  WATER_FLOW = 'water_flow',
  WATER_PRESSURE = 'water_pressure',
  NDVI = 'ndvi', // Normalized Difference Vegetation Index
}

export interface SensorReading {
  sensorId: string;
  deviceId: string;
  type: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
  quality?: number; // Signal quality 0-100
  batteryLevel?: number; // 0-100
}

export interface SensorConfig {
  id: string;
  deviceId: string;
  type: SensorType;
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  calibrationOffset?: number;
  samplingInterval: number; // in seconds
  thresholds: SensorThreshold[];
}

export interface SensorThreshold {
  id: string;
  name: string;
  type: 'min' | 'max' | 'range';
  value: number;
  maxValue?: number; // for range type
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

export interface SensorData {
  id: string;
  sensorId: string;
  zoneId: string;
  farmId: string;
  type: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SensorStats {
  sensorId: string;
  type: SensorType;
  period: 'hour' | 'day' | 'week' | 'month';
  min: number;
  max: number;
  avg: number;
  count: number;
  startTime: Date;
  endTime: Date;
}

export const SENSOR_UNITS: Record<SensorType, string> = {
  [SensorType.SOIL_MOISTURE]: '%',
  [SensorType.SOIL_TEMPERATURE]: '°C',
  [SensorType.SOIL_PH]: 'pH',
  [SensorType.SOIL_EC]: 'mS/cm',
  [SensorType.AIR_TEMPERATURE]: '°C',
  [SensorType.AIR_HUMIDITY]: '%',
  [SensorType.LIGHT_INTENSITY]: 'lux',
  [SensorType.UV_INDEX]: 'UV',
  [SensorType.WIND_SPEED]: 'm/s',
  [SensorType.WIND_DIRECTION]: '°',
  [SensorType.RAINFALL]: 'mm',
  [SensorType.ATMOSPHERIC_PRESSURE]: 'hPa',
  [SensorType.CO2_LEVEL]: 'ppm',
  [SensorType.LEAF_WETNESS]: '%',
  [SensorType.WATER_LEVEL]: 'cm',
  [SensorType.WATER_FLOW]: 'L/min',
  [SensorType.WATER_PRESSURE]: 'bar',
  [SensorType.NDVI]: '',
};

export const SENSOR_RANGES: Record<SensorType, { min: number; max: number }> = {
  [SensorType.SOIL_MOISTURE]: { min: 0, max: 100 },
  [SensorType.SOIL_TEMPERATURE]: { min: -10, max: 60 },
  [SensorType.SOIL_PH]: { min: 0, max: 14 },
  [SensorType.SOIL_EC]: { min: 0, max: 10 },
  [SensorType.AIR_TEMPERATURE]: { min: -40, max: 60 },
  [SensorType.AIR_HUMIDITY]: { min: 0, max: 100 },
  [SensorType.LIGHT_INTENSITY]: { min: 0, max: 120000 },
  [SensorType.UV_INDEX]: { min: 0, max: 15 },
  [SensorType.WIND_SPEED]: { min: 0, max: 50 },
  [SensorType.WIND_DIRECTION]: { min: 0, max: 360 },
  [SensorType.RAINFALL]: { min: 0, max: 500 },
  [SensorType.ATMOSPHERIC_PRESSURE]: { min: 900, max: 1100 },
  [SensorType.CO2_LEVEL]: { min: 300, max: 5000 },
  [SensorType.LEAF_WETNESS]: { min: 0, max: 100 },
  [SensorType.WATER_LEVEL]: { min: 0, max: 1000 },
  [SensorType.WATER_FLOW]: { min: 0, max: 500 },
  [SensorType.WATER_PRESSURE]: { min: 0, max: 10 },
  [SensorType.NDVI]: { min: -1, max: 1 },
};
