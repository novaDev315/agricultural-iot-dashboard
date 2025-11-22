import { Injectable } from '@nestjs/common';
import { FarmsService } from '../farms/farms.service';
import { SensorsService } from '../sensors/sensors.service';
import { IrrigationService } from '../irrigation/irrigation.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private farmsService: FarmsService,
    private sensorsService: SensorsService,
    private irrigationService: IrrigationService,
    private alertsService: AlertsService,
  ) {}

  async getDashboardSummary(farmId: string, userId: string) {
    const [farmStats, alertStats, waterUsage] = await Promise.all([
      this.farmsService.getStats(farmId, userId),
      this.alertsService.getAlertStats(farmId, userId),
      this.irrigationService.getWaterUsageStats(farmId, userId),
    ]);

    return {
      farm: farmStats,
      alerts: alertStats,
      water: waterUsage,
      lastUpdated: new Date(),
    };
  }

  async getResourceUsage(farmId: string, userId: string, period: 'day' | 'week' | 'month') {
    await this.farmsService.findOne(farmId, userId);

    const waterUsage = await this.irrigationService.getWaterUsageStats(farmId, userId);

    // Generate mock data for the period
    const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
    const dailyUsage = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      dailyUsage.push({
        date,
        waterLiters: 1000 + Math.random() * 2000,
        energyKwh: 10 + Math.random() * 20,
        cost: 15 + Math.random() * 30,
      });
    }

    const totalWater = dailyUsage.reduce((sum, d) => sum + d.waterLiters, 0);
    const totalEnergy = dailyUsage.reduce((sum, d) => sum + d.energyKwh, 0);
    const totalCost = dailyUsage.reduce((sum, d) => sum + d.cost, 0);

    return {
      period,
      startDate: dailyUsage[0]?.date,
      endDate: dailyUsage[dailyUsage.length - 1]?.date,
      summary: {
        totalWaterLiters: Math.round(totalWater),
        totalEnergyKwh: Math.round(totalEnergy * 10) / 10,
        totalCost: Math.round(totalCost * 100) / 100,
        avgDailyWater: Math.round(totalWater / days),
        avgDailyEnergy: Math.round((totalEnergy / days) * 10) / 10,
      },
      daily: dailyUsage,
      byZone: waterUsage.byZone,
    };
  }

  async getCropHealthMetrics(farmId: string, zoneId: string, userId: string) {
    await this.farmsService.findOne(farmId, userId);

    // Generate mock crop health data
    return {
      farmId,
      zoneId,
      date: new Date(),
      healthScore: 75 + Math.random() * 20,
      ndvi: 0.4 + Math.random() * 0.4,
      growthStage: 'Vegetative',
      stressIndicators: [
        {
          type: 'water',
          severity: 'low',
          confidence: 0.85,
          recommendation: 'Consider increasing irrigation by 10%',
        },
      ],
      diseaseRisk: 'low',
      pestRisk: 'low',
      yieldPrediction: {
        estimatedYield: 450,
        unit: 'kg/acre',
        confidence: 0.75,
        comparedToHistorical: 5,
      },
    };
  }

  async getFarmPerformance(farmId: string, userId: string, period: 'week' | 'month' | 'season') {
    await this.farmsService.findOne(farmId, userId);

    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      trends.push({
        date,
        waterEfficiency: 70 + Math.random() * 20,
        cropHealth: 75 + Math.random() * 15,
        systemUptime: 98 + Math.random() * 2,
      });
    }

    return {
      farmId,
      period,
      startDate: trends[0]?.date,
      endDate: trends[trends.length - 1]?.date,
      metrics: {
        waterEfficiency: Math.round(trends.reduce((sum, t) => sum + t.waterEfficiency, 0) / days),
        cropHealth: Math.round(trends.reduce((sum, t) => sum + t.cropHealth, 0) / days),
        systemUptime: Math.round((trends.reduce((sum, t) => sum + t.systemUptime, 0) / days) * 10) / 10,
        alertResponseTime: 15 + Math.random() * 30, // minutes
        automationSuccessRate: 92 + Math.random() * 6,
      },
      trends,
      recommendations: [
        {
          id: '1',
          type: 'optimization',
          priority: 'medium',
          title: 'Optimize irrigation schedule',
          description: 'Based on soil moisture patterns, shifting morning irrigation 30 minutes earlier could improve water efficiency by 10%.',
          potentialSavings: 150,
        },
        {
          id: '2',
          type: 'maintenance',
          priority: 'low',
          title: 'Sensor calibration due',
          description: 'Soil moisture sensors in Zone 2 show slight drift. Consider recalibrating within the next 2 weeks.',
        },
      ],
    };
  }

  async exportData(
    farmId: string,
    userId: string,
    dataType: string,
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'json',
  ) {
    await this.farmsService.findOne(farmId, userId);

    // Generate mock export data
    const data = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      data.push({
        timestamp: new Date(current),
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
        soilMoisture: 30 + Math.random() * 40,
      });
      current.setHours(current.getHours() + 1);
    }

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row) => Object.values(row).join(',')).join('\n');
      return { format: 'csv', data: `${headers}\n${rows}` };
    }

    return { format: 'json', data };
  }
}
