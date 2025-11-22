import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FarmsService } from '../farms/farms.service';

// In-memory storage for demo (replace with InfluxDB in production)
interface SensorReading {
  sensorId: string;
  deviceId: string;
  farmId: string;
  zoneId?: string;
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
}

@Injectable()
export class SensorsService {
  private readonly logger = new Logger(SensorsService.name);
  private sensorData: Map<string, SensorReading[]> = new Map();
  private latestReadings: Map<string, SensorReading> = new Map();

  constructor(
    private configService: ConfigService,
    private farmsService: FarmsService,
  ) {}

  async storeSensorReading(reading: SensorReading): Promise<void> {
    const key = `${reading.farmId}:${reading.deviceId}:${reading.type}`;

    // Store latest reading
    this.latestReadings.set(key, reading);

    // Store historical data
    if (!this.sensorData.has(key)) {
      this.sensorData.set(key, []);
    }

    const readings = this.sensorData.get(key)!;
    readings.push(reading);

    // Keep only last 1000 readings per sensor
    if (readings.length > 1000) {
      readings.shift();
    }

    this.logger.debug(`Stored sensor reading: ${key} = ${reading.value} ${reading.unit}`);
  }

  async getLatestReadings(farmId: string, userId: string): Promise<SensorReading[]> {
    await this.farmsService.findOne(farmId, userId);

    const readings: SensorReading[] = [];

    this.latestReadings.forEach((reading) => {
      if (reading.farmId === farmId) {
        readings.push(reading);
      }
    });

    return readings;
  }

  async getLatestByZone(farmId: string, zoneId: string, userId: string): Promise<SensorReading[]> {
    await this.farmsService.findOne(farmId, userId);

    const readings: SensorReading[] = [];

    this.latestReadings.forEach((reading) => {
      if (reading.farmId === farmId && reading.zoneId === zoneId) {
        readings.push(reading);
      }
    });

    return readings;
  }

  async getHistoricalData(
    farmId: string,
    deviceId: string,
    sensorType: string,
    startTime: Date,
    endTime: Date,
    userId: string,
  ): Promise<SensorReading[]> {
    await this.farmsService.findOne(farmId, userId);

    const key = `${farmId}:${deviceId}:${sensorType}`;
    const readings = this.sensorData.get(key) || [];

    return readings.filter(
      (r) => r.timestamp >= startTime && r.timestamp <= endTime,
    );
  }

  async getAggregatedData(
    farmId: string,
    sensorType: string,
    period: 'hour' | 'day' | 'week',
    userId: string,
  ): Promise<{ time: Date; min: number; max: number; avg: number }[]> {
    await this.farmsService.findOne(farmId, userId);

    const now = new Date();
    let startTime: Date;

    switch (period) {
      case 'hour':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    const allReadings: SensorReading[] = [];

    this.sensorData.forEach((readings, key) => {
      if (key.startsWith(farmId) && key.endsWith(sensorType)) {
        allReadings.push(...readings.filter((r) => r.timestamp >= startTime));
      }
    });

    if (allReadings.length === 0) {
      return [];
    }

    // Simple aggregation by hour
    const buckets = new Map<string, number[]>();

    allReadings.forEach((reading) => {
      const bucketTime = new Date(reading.timestamp);
      bucketTime.setMinutes(0, 0, 0);
      const bucketKey = bucketTime.toISOString();

      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, []);
      }
      buckets.get(bucketKey)!.push(reading.value);
    });

    const result: { time: Date; min: number; max: number; avg: number }[] = [];

    buckets.forEach((values, bucketKey) => {
      result.push({
        time: new Date(bucketKey),
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
      });
    });

    return result.sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  getLatestReading(farmId: string, deviceId: string, sensorType: string): SensorReading | null {
    const key = `${farmId}:${deviceId}:${sensorType}`;
    return this.latestReadings.get(key) || null;
  }
}
