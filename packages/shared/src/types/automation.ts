export enum AutomationStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  PAUSED = 'paused',
}

export enum TriggerType {
  SENSOR_VALUE = 'sensor_value',
  TIME_SCHEDULE = 'time_schedule',
  WEATHER_CONDITION = 'weather_condition',
  DEVICE_STATUS = 'device_status',
  MANUAL = 'manual',
  WEBHOOK = 'webhook',
}

export enum ActionType {
  IRRIGATION_START = 'irrigation_start',
  IRRIGATION_STOP = 'irrigation_stop',
  SEND_NOTIFICATION = 'send_notification',
  DEVICE_COMMAND = 'device_command',
  WEBHOOK_CALL = 'webhook_call',
  LOG_EVENT = 'log_event',
}

export interface AutomationRule {
  id: string;
  farmId: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  priority: number; // Higher priority rules execute first
  triggers: AutomationTrigger[];
  triggerLogic: 'and' | 'or';
  conditions?: AutomationCondition[]; // Additional conditions that must be met
  actions: AutomationAction[];
  cooldownMinutes: number;
  maxExecutionsPerDay?: number;
  executionCount: number;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  id: string;
  type: TriggerType;
  config: SensorTriggerConfig | TimeTriggerConfig | WeatherTriggerConfig | DeviceTriggerConfig;
}

export interface SensorTriggerConfig {
  sensorType: string;
  zoneId?: string;
  deviceId?: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between' | 'outside';
  value: number;
  maxValue?: number;
  durationSeconds?: number; // Condition must persist for this duration
}

export interface TimeTriggerConfig {
  type: 'daily' | 'weekly' | 'interval' | 'cron';
  time?: string; // HH:mm for daily
  daysOfWeek?: number[]; // 0-6 for weekly
  intervalMinutes?: number; // for interval
  cronExpression?: string; // for cron
  timezone?: string;
}

export interface WeatherTriggerConfig {
  condition: 'temperature' | 'humidity' | 'rain' | 'wind' | 'frost';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  forecast?: boolean; // Use forecasted vs current values
  forecastHours?: number;
}

export interface DeviceTriggerConfig {
  deviceId: string;
  status?: string;
  event?: string;
}

export interface AutomationCondition {
  id: string;
  type: 'time_window' | 'sensor_check' | 'weather_check' | 'flag';
  config: TimeWindowConfig | SensorCheckConfig | WeatherCheckConfig | FlagConfig;
}

export interface TimeWindowConfig {
  startTime: string; // HH:mm
  endTime: string;
  daysOfWeek?: number[];
}

export interface SensorCheckConfig {
  sensorType: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface WeatherCheckConfig {
  condition: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface FlagConfig {
  flag: string;
  value: boolean;
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: IrrigationActionConfig | NotificationActionConfig | DeviceActionConfig | WebhookActionConfig;
  delay?: number; // Delay in seconds before executing
  order: number;
}

export interface IrrigationActionConfig {
  systemId: string;
  command: 'start' | 'stop';
  duration?: number; // minutes
  valves?: number[];
}

export interface NotificationActionConfig {
  channels: ('email' | 'sms' | 'push' | 'slack')[];
  template: string;
  recipients?: string[];
}

export interface DeviceActionConfig {
  deviceId: string;
  command: string;
  payload?: Record<string, unknown>;
}

export interface WebhookActionConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export interface AutomationExecution {
  id: string;
  ruleId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  triggeredBy: string;
  triggerData?: Record<string, unknown>;
  actionsExecuted: ActionExecutionResult[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ActionExecutionResult {
  actionId: string;
  type: ActionType;
  status: 'success' | 'failed' | 'skipped';
  result?: Record<string, unknown>;
  error?: string;
  executedAt: Date;
}

export interface CreateAutomationRuleDto {
  farmId: string;
  name: string;
  description?: string;
  priority?: number;
  triggers: Omit<AutomationTrigger, 'id'>[];
  triggerLogic: 'and' | 'or';
  conditions?: Omit<AutomationCondition, 'id'>[];
  actions: Omit<AutomationAction, 'id'>[];
  cooldownMinutes: number;
  maxExecutionsPerDay?: number;
}
