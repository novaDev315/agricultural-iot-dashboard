// MQTT Topic Structure
// Base: agri-iot/{farmId}

export const MQTT_TOPICS = {
  // Sensor data topics
  SENSOR_DATA: 'agri-iot/{farmId}/sensors/{deviceId}/data',
  SENSOR_STATUS: 'agri-iot/{farmId}/sensors/{deviceId}/status',

  // Device topics
  DEVICE_TELEMETRY: 'agri-iot/{farmId}/devices/{deviceId}/telemetry',
  DEVICE_STATUS: 'agri-iot/{farmId}/devices/{deviceId}/status',
  DEVICE_COMMAND: 'agri-iot/{farmId}/devices/{deviceId}/command',
  DEVICE_RESPONSE: 'agri-iot/{farmId}/devices/{deviceId}/response',

  // Irrigation topics
  IRRIGATION_STATUS: 'agri-iot/{farmId}/irrigation/{systemId}/status',
  IRRIGATION_COMMAND: 'agri-iot/{farmId}/irrigation/{systemId}/command',
  IRRIGATION_RESPONSE: 'agri-iot/{farmId}/irrigation/{systemId}/response',
  IRRIGATION_EVENT: 'agri-iot/{farmId}/irrigation/{systemId}/event',

  // Weather topics
  WEATHER_DATA: 'agri-iot/{farmId}/weather/data',
  WEATHER_FORECAST: 'agri-iot/{farmId}/weather/forecast',
  WEATHER_ALERT: 'agri-iot/{farmId}/weather/alert',

  // Alert topics
  ALERT_NEW: 'agri-iot/{farmId}/alerts/new',
  ALERT_UPDATE: 'agri-iot/{farmId}/alerts/{alertId}/update',

  // Automation topics
  AUTOMATION_TRIGGER: 'agri-iot/{farmId}/automation/{ruleId}/trigger',
  AUTOMATION_RESULT: 'agri-iot/{farmId}/automation/{ruleId}/result',

  // System topics
  SYSTEM_HEARTBEAT: 'agri-iot/{farmId}/system/heartbeat',
  SYSTEM_ANNOUNCE: 'agri-iot/{farmId}/system/announce',
};

export function buildTopic(template: string, params: Record<string, string>): string {
  let topic = template;
  for (const [key, value] of Object.entries(params)) {
    topic = topic.replace(`{${key}}`, value);
  }
  return topic;
}

export function parseTopic(topic: string): { type: string; params: Record<string, string> } | null {
  const patterns = [
    { pattern: /^agri-iot\/([^/]+)\/sensors\/([^/]+)\/data$/, type: 'sensor_data', params: ['farmId', 'deviceId'] },
    { pattern: /^agri-iot\/([^/]+)\/sensors\/([^/]+)\/status$/, type: 'sensor_status', params: ['farmId', 'deviceId'] },
    { pattern: /^agri-iot\/([^/]+)\/devices\/([^/]+)\/telemetry$/, type: 'device_telemetry', params: ['farmId', 'deviceId'] },
    { pattern: /^agri-iot\/([^/]+)\/devices\/([^/]+)\/status$/, type: 'device_status', params: ['farmId', 'deviceId'] },
    { pattern: /^agri-iot\/([^/]+)\/devices\/([^/]+)\/command$/, type: 'device_command', params: ['farmId', 'deviceId'] },
    { pattern: /^agri-iot\/([^/]+)\/irrigation\/([^/]+)\/status$/, type: 'irrigation_status', params: ['farmId', 'systemId'] },
    { pattern: /^agri-iot\/([^/]+)\/irrigation\/([^/]+)\/command$/, type: 'irrigation_command', params: ['farmId', 'systemId'] },
    { pattern: /^agri-iot\/([^/]+)\/weather\/data$/, type: 'weather_data', params: ['farmId'] },
    { pattern: /^agri-iot\/([^/]+)\/alerts\/new$/, type: 'alert_new', params: ['farmId'] },
  ];

  for (const { pattern, type, params } of patterns) {
    const match = topic.match(pattern);
    if (match) {
      const paramValues: Record<string, string> = {};
      params.forEach((param, index) => {
        paramValues[param] = match[index + 1];
      });
      return { type, params: paramValues };
    }
  }

  return null;
}

// QoS Levels
export const MQTT_QOS = {
  AT_MOST_ONCE: 0 as const,   // Fire and forget
  AT_LEAST_ONCE: 1 as const,  // Acknowledged delivery
  EXACTLY_ONCE: 2 as const,   // Assured delivery
};

// Recommended QoS for different message types
export const TOPIC_QOS = {
  SENSOR_DATA: MQTT_QOS.AT_LEAST_ONCE,
  DEVICE_COMMAND: MQTT_QOS.EXACTLY_ONCE,
  IRRIGATION_COMMAND: MQTT_QOS.EXACTLY_ONCE,
  ALERT: MQTT_QOS.AT_LEAST_ONCE,
  TELEMETRY: MQTT_QOS.AT_MOST_ONCE,
};
