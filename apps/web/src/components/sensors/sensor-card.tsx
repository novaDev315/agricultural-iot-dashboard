'use client';

import { Thermometer, Droplets, Sun, Wind, Leaf, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorReading {
  id: string;
  type: string;
  name: string;
  value: number;
  unit: string;
  zone: string;
  deviceId: string;
  status: 'normal' | 'warning' | 'critical';
  trend: number;
  lastUpdate: Date;
}

interface SensorCardProps {
  sensor: SensorReading;
  onClick: () => void;
  isSelected: boolean;
}

const iconMap: Record<string, typeof Thermometer> = {
  soil_moisture: Droplets,
  air_temperature: Thermometer,
  air_humidity: Droplets,
  soil_temperature: Thermometer,
  light_intensity: Sun,
  wind_speed: Wind,
  soil_ph: Leaf,
  water_pressure: Gauge,
};

const statusColors = {
  normal: 'border-green-200 bg-green-50',
  warning: 'border-yellow-200 bg-yellow-50',
  critical: 'border-red-200 bg-red-50',
};

const statusIconColors = {
  normal: 'text-green-600',
  warning: 'text-yellow-600',
  critical: 'text-red-600',
};

export function SensorCard({ sensor, onClick, isSelected }: SensorCardProps) {
  const Icon = iconMap[sensor.type] || Gauge;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md',
        statusColors[sensor.status],
        isSelected && 'ring-2 ring-primary-500 ring-offset-2'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className={cn('h-5 w-5', statusIconColors[sensor.status])} />
        <div className="flex items-center text-xs">
          {sensor.trend > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
      <p className="text-2xl font-bold text-secondary-900">
        {sensor.value}
        <span className="text-sm font-normal text-secondary-500 ml-1">{sensor.unit}</span>
      </p>
      <p className="text-sm text-secondary-600 mt-1">{sensor.name}</p>
      <p className="text-xs text-secondary-400 mt-1">{sensor.zone}</p>
    </button>
  );
}
