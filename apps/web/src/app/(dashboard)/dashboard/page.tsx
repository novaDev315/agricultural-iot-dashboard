'use client';

import { useEffect, useState } from 'react';
import { useFarmStore } from '@/stores/farm-store';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SensorGrid } from '@/components/dashboard/sensor-grid';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { AlertsWidget } from '@/components/dashboard/alerts-widget';
import { IrrigationWidget } from '@/components/dashboard/irrigation-widget';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import {
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Sprout,
  Activity,
  CloudRain,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const { currentFarm, fetchFarms, farms } = useFarmStore();
  const [stats, setStats] = useState({
    temperature: 24.5,
    humidity: 65,
    soilMoisture: 42,
    activeAlerts: 3,
    devicesOnline: 18,
    totalDevices: 20,
    waterUsedToday: 1250,
    automationsRun: 12,
  });

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        temperature: 22 + Math.random() * 6,
        humidity: 55 + Math.random() * 20,
        soilMoisture: 35 + Math.random() * 20,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500">
          {currentFarm ? `Monitoring ${currentFarm.name}` : 'Select a farm to get started'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Temperature"
          value={`${stats.temperature.toFixed(1)}°C`}
          icon={Thermometer}
          trend={{ value: 2.3, isPositive: false }}
          color="orange"
        />
        <StatsCard
          title="Humidity"
          value={`${stats.humidity.toFixed(0)}%`}
          icon={Droplets}
          trend={{ value: 5, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Soil Moisture"
          value={`${stats.soilMoisture.toFixed(0)}%`}
          icon={Sprout}
          trend={{ value: 1.2, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts.toString()}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Devices Online"
          value={`${stats.devicesOnline}/${stats.totalDevices}`}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Water Used Today"
          value={`${stats.waterUsedToday}L`}
          icon={CloudRain}
          trend={{ value: 8, isPositive: false }}
          color="blue"
        />
        <StatsCard
          title="Wind Speed"
          value="3.2 m/s"
          icon={Wind}
          color="cyan"
        />
        <StatsCard
          title="Automations Run"
          value={stats.automationsRun.toString()}
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SensorGrid />
          <ActivityChart />
        </div>
        <div className="space-y-6">
          <WeatherWidget />
          <AlertsWidget />
          <IrrigationWidget />
        </div>
      </div>
    </div>
  );
}
