'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Clock,
  Filter,
  Check,
  Eye,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'sensor_threshold' | 'device_offline' | 'low_battery' | 'irrigation_failed' | 'weather_alert' | 'frost_warning';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  status: 'active' | 'acknowledged' | 'resolved';
  title: string;
  message: string;
  zone: string;
  deviceId?: string;
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

const mockAlerts: Alert[] = [
  { id: '1', type: 'sensor_threshold', severity: 'critical', status: 'active', title: 'Low Soil Moisture Critical', message: 'West Field moisture dropped below 15%. Immediate irrigation required.', zone: 'West Field', deviceId: 'SNS-005', createdAt: new Date(Date.now() - 300000) },
  { id: '2', type: 'device_offline', severity: 'warning', status: 'active', title: 'Device Offline', message: 'Sensor node SNS-004 has been offline for 1 hour.', zone: 'West Field', deviceId: 'SNS-004', createdAt: new Date(Date.now() - 3600000) },
  { id: '3', type: 'low_battery', severity: 'warning', status: 'active', title: 'Low Battery Warning', message: 'Greenhouse sensor battery at 12%. Replace battery soon.', zone: 'Greenhouse', deviceId: 'SNS-003', createdAt: new Date(Date.now() - 7200000) },
  { id: '4', type: 'weather_alert', severity: 'info', status: 'acknowledged', title: 'Rain Forecast', message: 'Heavy rain expected in 6 hours. Irrigation schedule may be affected.', zone: 'All', createdAt: new Date(Date.now() - 10800000), acknowledgedAt: new Date(Date.now() - 9000000) },
  { id: '5', type: 'frost_warning', severity: 'emergency', status: 'active', title: 'Frost Warning', message: 'Temperature expected to drop below freezing tonight. Take protective measures.', zone: 'All', createdAt: new Date(Date.now() - 1800000) },
  { id: '6', type: 'sensor_threshold', severity: 'warning', status: 'resolved', title: 'High Temperature Alert', message: 'Greenhouse temperature exceeded 35°C threshold.', zone: 'Greenhouse', deviceId: 'SNS-003', createdAt: new Date(Date.now() - 86400000), resolvedAt: new Date(Date.now() - 82800000) },
  { id: '7', type: 'irrigation_failed', severity: 'critical', status: 'resolved', title: 'Irrigation System Error', message: 'North Field irrigation failed to start. Valve malfunction detected.', zone: 'North Field', deviceId: 'IRC-001', createdAt: new Date(Date.now() - 172800000), resolvedAt: new Date(Date.now() - 169200000) },
];

const severityConfig = {
  info: { icon: Info, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  warning: { icon: AlertTriangle, color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  critical: { icon: AlertCircle, color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  emergency: { icon: AlertCircle, color: 'red', bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  const filteredAlerts = alerts
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => !severityFilter || a.severity === severityFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const stats = {
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    emergency: alerts.filter(a => a.severity === 'emergency' && a.status === 'active').length,
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'acknowledged' as const, acknowledgedAt: new Date() } : a
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'resolved' as const, resolvedAt: new Date() } : a
    ));
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Alerts</h1>
          <p className="text-secondary-500">Monitor and manage system alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
            <Bell className="h-4 w-4 mr-2" />
            Alert Rules
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats.active > 0 && (
        <div className={cn(
          'p-4 rounded-xl border-2',
          stats.emergency > 0 ? 'bg-red-50 border-red-200' : stats.critical > 0 ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className={cn(
                'h-6 w-6 mr-3',
                stats.emergency > 0 ? 'text-red-600' : stats.critical > 0 ? 'text-orange-600' : 'text-yellow-600'
              )} />
              <div>
                <p className="font-semibold text-secondary-900">
                  {stats.active} Active Alert{stats.active !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-secondary-600">
                  {stats.emergency > 0 && `${stats.emergency} emergency, `}
                  {stats.critical > 0 && `${stats.critical} critical`}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-secondary-900 rounded-lg hover:bg-secondary-800">
              Acknowledge All
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'acknowledged', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              filter === f
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'active' && stats.active > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {stats.active}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'p-4 rounded-xl border-2 transition-all',
                config.bg,
                config.border,
                alert.status === 'resolved' && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <Icon className={cn('h-5 w-5 mt-0.5 mr-3', config.text)} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-secondary-900">{alert.title}</h3>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        alert.status === 'active' && 'bg-red-100 text-red-700',
                        alert.status === 'acknowledged' && 'bg-yellow-100 text-yellow-700',
                        alert.status === 'resolved' && 'bg-green-100 text-green-700'
                      )}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(alert.createdAt)}
                      </span>
                      <span>Zone: {alert.zone}</span>
                      {alert.deviceId && <span>Device: {alert.deviceId}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="p-2 rounded-lg hover:bg-white/50 text-secondary-500 hover:text-secondary-700"
                        title="Acknowledge"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="p-2 rounded-lg hover:bg-white/50 text-secondary-500 hover:text-green-600"
                        title="Resolve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {alert.status === 'acknowledged' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="p-2 rounded-lg hover:bg-white/50 text-secondary-500 hover:text-green-600"
                      title="Resolve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-white/50 text-secondary-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-secondary-600">No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
