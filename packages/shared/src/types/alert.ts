export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
}

export enum AlertType {
  SENSOR_THRESHOLD = 'sensor_threshold',
  DEVICE_OFFLINE = 'device_offline',
  LOW_BATTERY = 'low_battery',
  IRRIGATION_FAILED = 'irrigation_failed',
  WEATHER_ALERT = 'weather_alert',
  PEST_DETECTION = 'pest_detection',
  DISEASE_RISK = 'disease_risk',
  FROST_WARNING = 'frost_warning',
  SYSTEM_ERROR = 'system_error',
  AUTOMATION_TRIGGERED = 'automation_triggered',
  WATER_LEAK = 'water_leak',
  SCHEDULED_MAINTENANCE = 'scheduled_maintenance',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SNOOZED = 'snoozed',
}

export interface Alert {
  id: string;
  farmId: string;
  zoneId?: string;
  deviceId?: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  snoozedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertRule {
  id: string;
  farmId: string;
  name: string;
  description?: string;
  enabled: boolean;
  conditions: AlertCondition[];
  conditionLogic: 'and' | 'or';
  severity: AlertSeverity;
  cooldownMinutes: number; // Minimum time between alerts
  notifications: AlertNotification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  id: string;
  type: 'sensor' | 'device' | 'weather' | 'time';
  sensorType?: string;
  deviceId?: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between' | 'outside';
  value: number;
  maxValue?: number; // For 'between' and 'outside' operators
  duration?: number; // Condition must be true for this many seconds
}

export interface AlertNotification {
  channel: 'email' | 'sms' | 'push' | 'slack' | 'webhook';
  recipients: string[];
  template?: string;
  enabled: boolean;
}

export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    address: string;
    severities: AlertSeverity[];
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
    severities: AlertSeverity[];
  };
  push: {
    enabled: boolean;
    severities: AlertSeverity[];
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    exceptEmergency: boolean;
  };
}

export interface AlertStats {
  farmId: string;
  period: 'day' | 'week' | 'month';
  totalAlerts: number;
  bySeverity: Record<AlertSeverity, number>;
  byType: Record<AlertType, number>;
  avgResponseTime: number; // minutes to acknowledge
  resolvedCount: number;
  activeCount: number;
}

export interface CreateAlertRuleDto {
  farmId: string;
  name: string;
  description?: string;
  conditions: Omit<AlertCondition, 'id'>[];
  conditionLogic: 'and' | 'or';
  severity: AlertSeverity;
  cooldownMinutes: number;
  notifications: AlertNotification[];
}

export interface AcknowledgeAlertDto {
  alertId: string;
  userId: string;
  notes?: string;
}

export interface ResolveAlertDto {
  alertId: string;
  userId: string;
  resolution?: string;
}
