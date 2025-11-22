export interface ResourceUsage {
  farmId: string;
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  water: WaterUsage;
  energy?: EnergyUsage;
  costs: CostAnalysis;
}

export interface WaterUsage {
  totalLiters: number;
  byZone: { zoneId: string; zoneName: string; liters: number }[];
  bySystem: { systemId: string; systemName: string; liters: number }[];
  dailyAverage: number;
  comparedToPrevious: number; // percentage change
  efficiency?: number; // liters per acre
}

export interface EnergyUsage {
  totalKwh: number;
  byDevice: { deviceId: string; deviceName: string; kwh: number }[];
  byType: { type: string; kwh: number }[];
  dailyAverage: number;
  comparedToPrevious: number;
  cost?: number;
}

export interface CostAnalysis {
  totalCost: number;
  waterCost: number;
  energyCost: number;
  savingsEstimate: number;
  costPerAcre: number;
  currency: string;
}

export interface CropHealthMetrics {
  farmId: string;
  zoneId: string;
  date: Date;
  healthScore: number; // 0-100
  ndvi?: number;
  growthStage?: string;
  stressIndicators: StressIndicator[];
  diseaseRisk: RiskLevel;
  pestRisk: RiskLevel;
  yieldPrediction?: YieldPrediction;
}

export interface StressIndicator {
  type: 'water' | 'nutrient' | 'temperature' | 'disease' | 'pest';
  severity: 'low' | 'moderate' | 'high';
  confidence: number;
  recommendation?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface YieldPrediction {
  estimatedYield: number;
  unit: string;
  confidence: number;
  comparedToHistorical: number; // percentage
  factors: { factor: string; impact: number }[];
}

export interface FarmPerformance {
  farmId: string;
  period: 'week' | 'month' | 'season' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    waterEfficiency: number;
    cropHealth: number;
    systemUptime: number;
    alertResponseTime: number;
    automationSuccessRate: number;
  };
  trends: PerformanceTrend[];
  recommendations: Recommendation[];
}

export interface PerformanceTrend {
  metric: string;
  values: { date: Date; value: number }[];
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'maintenance' | 'upgrade' | 'action';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  potentialSavings?: number;
  potentialImpact?: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export enum WidgetType {
  SENSOR_GAUGE = 'sensor_gauge',
  SENSOR_CHART = 'sensor_chart',
  ZONE_MAP = 'zone_map',
  WEATHER_CARD = 'weather_card',
  IRRIGATION_STATUS = 'irrigation_status',
  ALERT_LIST = 'alert_list',
  RESOURCE_USAGE = 'resource_usage',
  CROP_HEALTH = 'crop_health',
  QUICK_ACTIONS = 'quick_actions',
  FARM_STATS = 'farm_stats',
}

export interface ReportConfig {
  id: string;
  farmId: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  sections: ReportSection[];
  recipients: string[];
  schedule?: {
    enabled: boolean;
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
  format: 'pdf' | 'csv' | 'excel';
  createdAt: Date;
}

export interface ReportSection {
  type: 'sensor_summary' | 'irrigation_summary' | 'alert_summary' | 'resource_usage' | 'crop_health' | 'weather_summary';
  title: string;
  config?: Record<string, unknown>;
}

export interface ExportRequest {
  farmId: string;
  dataType: 'sensors' | 'irrigation' | 'alerts' | 'weather' | 'all';
  startDate: Date;
  endDate: Date;
  format: 'csv' | 'json' | 'excel';
  zoneIds?: string[];
  sensorTypes?: string[];
}
