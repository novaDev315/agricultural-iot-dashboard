import { SensorType, SENSOR_RANGES } from '../types/sensor';

export function validateSensorReading(type: SensorType, value: number): { valid: boolean; error?: string } {
  const range = SENSOR_RANGES[type];
  if (!range) {
    return { valid: false, error: `Unknown sensor type: ${type}` };
  }

  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Value must be a valid number' };
  }

  if (value < range.min || value > range.max) {
    return {
      valid: false,
      error: `Value ${value} is outside valid range [${range.min}, ${range.max}]`
    };
  }

  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return { valid: errors.length === 0, errors };
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function validateTimeRange(startTime: string, endTime: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(startTime) && timeRegex.test(endTime);
}

export function validateDeviceId(deviceId: string): boolean {
  // Device ID format: XX:XX:XX:XX:XX:XX (MAC address) or alphanumeric
  const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
  const alphanumericRegex = /^[a-zA-Z0-9_-]{6,32}$/;
  return macRegex.test(deviceId) || alphanumericRegex.test(deviceId);
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function validatePolygon(coordinates: { latitude: number; longitude: number }[]): boolean {
  if (coordinates.length < 3) {
    return false;
  }

  // Check all coordinates are valid
  for (const coord of coordinates) {
    if (!validateCoordinates(coord.latitude, coord.longitude)) {
      return false;
    }
  }

  return true;
}

export function parseNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return defaultValue;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
