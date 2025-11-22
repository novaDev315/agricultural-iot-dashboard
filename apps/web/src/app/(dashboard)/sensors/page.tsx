'use client';

import { useState, useEffect } from 'react';
import { useFarmStore } from '@/stores/farm-store';
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Leaf,
  Gauge,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SensorChart } from '@/components/sensors/sensor-chart';
import { SensorCard } from '@/components/sensors/sensor-card';

const sensorTypes = [
  { type: 'soil_moisture', name: 'Soil Moisture', icon: Droplets, unit: '%', color: 'blue' },
  { type: 'air_temperature', name: 'Air Temperature', icon: Thermometer, unit: '°C', color: 'orange' },
  { type: 'air_humidity', name: 'Air Humidity', icon: Droplets, unit: '%', color: 'cyan' },
  { type: 'soil_temperature', name: 'Soil Temperature', icon: Thermometer, unit: '°C', color: 'amber' },
  { type: 'light_intensity', name: 'Light Intensity', icon: Sun, unit: 'lux', color: 'yellow' },
  { type: 'wind_speed', name: 'Wind Speed', icon: Wind, unit: 'm/s', color: 'slate' },
  { type: 'soil_ph', name: 'Soil pH', icon: Leaf, unit: 'pH', color: 'green' },
  { type: 'water_pressure', name: 'Water Pressure', icon: Gauge, unit: 'bar', color: 'indigo' },
];

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

export default function SensorsPage() {
  const { currentFarm } = useFarmStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock sensor data
  useEffect(() => {
    const generateSensors = () => {
      const zones = ['North Field', 'South Field', 'Greenhouse', 'East Plot', 'West Plot'];
      const mockSensors: SensorReading[] = [];

      zones.forEach((zone, zoneIndex) => {
        sensorTypes.forEach((sensorType, typeIndex) => {
          const baseValues: Record<string, number> = {
            soil_moisture: 35 + Math.random() * 30,
            air_temperature: 20 + Math.random() * 10,
            air_humidity: 50 + Math.random() * 30,
            soil_temperature: 15 + Math.random() * 10,
            light_intensity: 30000 + Math.random() * 40000,
            wind_speed: 1 + Math.random() * 8,
            soil_ph: 5.5 + Math.random() * 2,
            water_pressure: 1.5 + Math.random() * 2,
          };

          const value = baseValues[sensorType.type] || 50;
          let status: 'normal' | 'warning' | 'critical' = 'normal';

          if (sensorType.type === 'soil_moisture' && value < 30) status = 'warning';
          if (sensorType.type === 'soil_moisture' && value < 20) status = 'critical';
          if (sensorType.type === 'air_temperature' && value > 32) status = 'warning';

          mockSensors.push({
            id: `sensor-${zoneIndex}-${typeIndex}`,
            type: sensorType.type,
            name: sensorType.name,
            value: Math.round(value * 10) / 10,
            unit: sensorType.unit,
            zone,
            deviceId: `device-${zoneIndex + 1}`,
            status,
            trend: (Math.random() - 0.5) * 10,
            lastUpdate: new Date(),
          });
        });
      });

      setSensors(mockSensors);
    };

    generateSensors();
    const interval = setInterval(generateSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredSensors = selectedType
    ? sensors.filter((s) => s.type === selectedType)
    : sensors;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getSensorStats = (type: string) => {
    const typeSensors = sensors.filter((s) => s.type === type);
    if (typeSensors.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };

    const values = typeSensors.map((s) => s.value);
    return {
      avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
      min: Math.round(Math.min(...values) * 10) / 10,
      max: Math.round(Math.max(...values) * 10) / 10,
      count: typeSensors.length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Sensors</h1>
          <p className="text-secondary-500">
            Monitor all sensors across {currentFarm?.name || 'your farm'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50"
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
            Refresh
          </button>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Sensor Type Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
              'flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              !selectedType
                ? 'bg-primary-100 text-primary-700'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
            )}
          >
            <Activity className="h-4 w-4 mr-2" />
            All Sensors ({sensors.length})
          </button>
          {sensorTypes.map((type) => {
            const Icon = type.icon;
            const count = sensors.filter((s) => s.type === type.type).length;
            return (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  selectedType === type.type
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {type.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Overview */}
      {selectedType && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const stats = getSensorStats(selectedType);
            const typeInfo = sensorTypes.find((t) => t.type === selectedType);
            return (
              <>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                  <p className="text-sm text-secondary-500">Average</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stats.avg} {typeInfo?.unit}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                  <p className="text-sm text-secondary-500">Minimum</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.min} {typeInfo?.unit}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                  <p className="text-sm text-secondary-500">Maximum</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.max} {typeInfo?.unit}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
                  <p className="text-sm text-secondary-500">Active Sensors</p>
                  <p className="text-2xl font-bold text-green-600">{stats.count}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
            <div className="p-4 border-b border-secondary-100">
              <h2 className="font-semibold text-secondary-900">Live Readings</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSensors.map((sensor) => (
                  <SensorCard
                    key={sensor.id}
                    sensor={sensor}
                    onClick={() => setSelectedSensor(sensor)}
                    isSelected={selectedSensor?.id === sensor.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Details */}
        <div className="lg:col-span-1">
          {selectedSensor ? (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 sticky top-20">
              <div className="p-4 border-b border-secondary-100">
                <h2 className="font-semibold text-secondary-900">Sensor Details</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Sensor Type</p>
                  <p className="font-medium text-secondary-900">{selectedSensor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Current Value</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    {selectedSensor.value}
                    <span className="text-lg font-normal text-secondary-500 ml-1">
                      {selectedSensor.unit}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Zone</p>
                  <p className="font-medium text-secondary-900">{selectedSensor.zone}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Device ID</p>
                  <p className="font-medium text-secondary-900">{selectedSensor.deviceId}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Trend</p>
                  <div className="flex items-center">
                    {selectedSensor.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={selectedSensor.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(selectedSensor.trend).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Status</p>
                  <span
                    className={cn(
                      'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                      selectedSensor.status === 'normal' && 'bg-green-100 text-green-700',
                      selectedSensor.status === 'warning' && 'bg-yellow-100 text-yellow-700',
                      selectedSensor.status === 'critical' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {selectedSensor.status.charAt(0).toUpperCase() + selectedSensor.status.slice(1)}
                  </span>
                </div>

                {/* Mini Chart */}
                <div className="pt-4 border-t border-secondary-100">
                  <p className="text-sm text-secondary-500 mb-3">24h History</p>
                  <SensorChart sensorType={selectedSensor.type} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8 text-center">
              <Activity className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">Select a sensor to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
