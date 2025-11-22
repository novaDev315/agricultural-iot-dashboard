'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Wind, Leaf, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorData {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  zone: string;
  icon: typeof Thermometer;
}

const mockSensors: SensorData[] = [
  { id: '1', name: 'Soil Moisture', type: 'soil_moisture', value: 42, unit: '%', status: 'normal', zone: 'North Field', icon: Droplets },
  { id: '2', name: 'Air Temperature', type: 'air_temperature', value: 24.5, unit: '°C', status: 'normal', zone: 'North Field', icon: Thermometer },
  { id: '3', name: 'Air Humidity', type: 'air_humidity', value: 65, unit: '%', status: 'normal', zone: 'North Field', icon: Droplets },
  { id: '4', name: 'Light Intensity', type: 'light_intensity', value: 45000, unit: 'lux', status: 'normal', zone: 'Greenhouse', icon: Sun },
  { id: '5', name: 'Soil Temperature', type: 'soil_temperature', value: 18.3, unit: '°C', status: 'normal', zone: 'South Field', icon: Thermometer },
  { id: '6', name: 'Wind Speed', type: 'wind_speed', value: 3.2, unit: 'm/s', status: 'normal', zone: 'Weather Station', icon: Wind },
  { id: '7', name: 'Soil pH', type: 'soil_ph', value: 6.5, unit: 'pH', status: 'normal', zone: 'East Plot', icon: Leaf },
  { id: '8', name: 'Water Pressure', type: 'water_pressure', value: 2.1, unit: 'bar', status: 'warning', zone: 'Irrigation', icon: Gauge },
];

const statusColors = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

export function SensorGrid() {
  const [sensors, setSensors] = useState(mockSensors);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev =>
        prev.map(sensor => ({
          ...sensor,
          value: sensor.type === 'soil_moisture'
            ? Math.max(0, Math.min(100, sensor.value + (Math.random() - 0.5) * 2))
            : sensor.type === 'air_temperature'
            ? sensor.value + (Math.random() - 0.5) * 0.5
            : sensor.type === 'air_humidity'
            ? Math.max(0, Math.min(100, sensor.value + (Math.random() - 0.5) * 1))
            : sensor.value,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
      <div className="p-5 border-b border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900">Live Sensor Readings</h2>
        <p className="text-sm text-secondary-500">Real-time data from all connected sensors</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <div
                key={sensor.id}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:shadow-md',
                  statusColors[sensor.status]
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50">
                    {sensor.zone}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {typeof sensor.value === 'number' ? sensor.value.toFixed(1) : sensor.value}
                  <span className="text-sm font-normal ml-1">{sensor.unit}</span>
                </p>
                <p className="text-sm mt-1 opacity-80">{sensor.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
