'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Droplets,
  Zap,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Leaf,
  Sun,
  CloudRain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: typeof BarChart3;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
}

const metrics: MetricCard[] = [
  { title: 'Water Usage', value: '12,450 L', change: -12.5, changeLabel: 'vs last month', icon: Droplets, color: 'blue' },
  { title: 'Energy Consumption', value: '845 kWh', change: -8.3, changeLabel: 'vs last month', icon: Zap, color: 'yellow' },
  { title: 'Cost Savings', value: '$2,340', change: 15.2, changeLabel: 'vs last month', icon: DollarSign, color: 'green' },
  { title: 'Crop Health Index', value: '87%', change: 3.4, changeLabel: 'vs last month', icon: Leaf, color: 'emerald' },
];

const weeklyWaterData: ChartData[] = [
  { label: 'Mon', value: 1850 },
  { label: 'Tue', value: 2100 },
  { label: 'Wed', value: 1650 },
  { label: 'Thu', value: 1900 },
  { label: 'Fri', value: 2300 },
  { label: 'Sat', value: 1400 },
  { label: 'Sun', value: 1250 },
];

const monthlyData: ChartData[] = [
  { label: 'Jan', value: 45000 },
  { label: 'Feb', value: 42000 },
  { label: 'Mar', value: 48000 },
  { label: 'Apr', value: 52000 },
  { label: 'May', value: 58000 },
  { label: 'Jun', value: 62000 },
  { label: 'Jul', value: 68000 },
  { label: 'Aug', value: 65000 },
  { label: 'Sep', value: 55000 },
  { label: 'Oct', value: 48000 },
  { label: 'Nov', value: 42000 },
  { label: 'Dec', value: 38000 },
];

const zoneData = [
  { name: 'North Field', water: 3200, energy: 180, health: 92 },
  { name: 'South Field', water: 2800, energy: 155, health: 78 },
  { name: 'East Plot', water: 1900, energy: 95, health: 88 },
  { name: 'West Field', water: 3100, energy: 170, health: 65 },
  { name: 'Greenhouse', water: 1450, energy: 245, health: 95 },
];

function BarChartSimple({ data, maxValue, color = 'primary' }: { data: ChartData[]; maxValue: number; color?: string }) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="flex items-end justify-between h-48 gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="w-full bg-secondary-100 rounded-t-sm relative" style={{ height: '160px' }}>
            <div
              className={cn('absolute bottom-0 w-full rounded-t-sm transition-all', colorClasses[color])}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-secondary-500 mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChartSimple({ data, maxValue }: { data: ChartData[]; maxValue: number }) {
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
        ))}

        {/* Area */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
          opacity="0.3"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />

        {/* Points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return (
            <circle key={index} cx={x} cy={y} r="1.5" fill="#22c55e" vectorEffect="non-scaling-stroke" />
          );
        })}

        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-xs text-secondary-400 mt-2">
        {data.filter((_, i) => i % 2 === 0).map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'water' | 'energy' | 'health'>('water');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-500">Resource usage and performance insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  timeRange === range ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-secondary-100">
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                metric.color === 'blue' && 'bg-blue-100',
                metric.color === 'yellow' && 'bg-yellow-100',
                metric.color === 'green' && 'bg-green-100',
                metric.color === 'emerald' && 'bg-emerald-100'
              )}>
                <metric.icon className={cn(
                  'h-5 w-5',
                  metric.color === 'blue' && 'text-blue-600',
                  metric.color === 'yellow' && 'text-yellow-600',
                  metric.color === 'green' && 'text-green-600',
                  metric.color === 'emerald' && 'text-emerald-600'
                )} />
              </div>
              <div className={cn(
                'flex items-center text-sm font-medium',
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {metric.change > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-secondary-900">{metric.value}</p>
            <p className="text-sm text-secondary-500 mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Usage Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">Water Usage</h2>
              <p className="text-sm text-secondary-500">Daily consumption this week</p>
            </div>
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <BarChartSimple data={weeklyWaterData} maxValue={2500} color="blue" />
          <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between text-sm">
            <div>
              <p className="text-secondary-500">Total</p>
              <p className="font-semibold text-secondary-900">12,450 L</p>
            </div>
            <div>
              <p className="text-secondary-500">Average</p>
              <p className="font-semibold text-secondary-900">1,778 L/day</p>
            </div>
            <div>
              <p className="text-secondary-500">Peak</p>
              <p className="font-semibold text-secondary-900">2,300 L (Fri)</p>
            </div>
          </div>
        </div>

        {/* Yearly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">Yearly Trend</h2>
              <p className="text-sm text-secondary-500">Water consumption by month</p>
            </div>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <LineChartSimple data={monthlyData} maxValue={75000} />
          <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between text-sm">
            <div>
              <p className="text-secondary-500">YTD Total</p>
              <p className="font-semibold text-secondary-900">623,000 L</p>
            </div>
            <div>
              <p className="text-secondary-500">vs Last Year</p>
              <p className="font-semibold text-green-600">-8.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Zone Comparison</h2>
            <p className="text-sm text-secondary-500">Resource usage and health by zone</p>
          </div>
          <div className="flex bg-secondary-100 rounded-lg p-1">
            {(['water', 'energy', 'health'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  selectedMetric === metric ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
                )}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {zoneData.map((zone, index) => {
            const value = zone[selectedMetric];
            const maxValues = { water: 3500, energy: 300, health: 100 };
            const max = maxValues[selectedMetric];
            const units = { water: 'L', energy: 'kWh', health: '%' };
            const colors = {
              water: 'bg-blue-500',
              energy: 'bg-yellow-500',
              health: zone.health >= 80 ? 'bg-green-500' : zone.health >= 60 ? 'bg-yellow-500' : 'bg-red-500',
            };

            return (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-secondary-700">{zone.name}</div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', colors[selectedMetric])}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium text-secondary-900">
                  {value} {units[selectedMetric]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Efficiency Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <CloudRain className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Rain Savings</h3>
          <p className="text-3xl font-bold mb-1">4,200 L</p>
          <p className="text-sm opacity-80">Saved this month by rain-based automation</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Leaf className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Yield Forecast</h3>
          <p className="text-3xl font-bold mb-1">+12%</p>
          <p className="text-sm opacity-80">Expected increase vs last season</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <Sun className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Solar Efficiency</h3>
          <p className="text-3xl font-bold mb-1">89%</p>
          <p className="text-sm opacity-80">Of irrigation powered by solar</p>
        </div>
      </div>
    </div>
  );
}
