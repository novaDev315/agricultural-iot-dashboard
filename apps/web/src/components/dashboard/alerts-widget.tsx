'use client';

import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const alerts = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Soil Moisture',
    message: 'North Field Zone 2 moisture at 25%',
    time: '10 min ago',
  },
  {
    id: '2',
    type: 'critical',
    title: 'Device Offline',
    message: 'Sensor node SNS-004 not responding',
    time: '25 min ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'Irrigation Completed',
    message: 'South Field automated irrigation finished',
    time: '1 hour ago',
  },
];

const alertStyles = {
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export function AlertsWidget() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
      <div className="p-4 border-b border-secondary-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-secondary-900">Recent Alerts</h3>
          <p className="text-xs text-secondary-500">3 active alerts</p>
        </div>
        <button className="text-xs text-primary-600 font-medium hover:text-primary-700">
          View All
        </button>
      </div>
      <div className="p-2">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type as keyof typeof alertStyles];
          const Icon = style.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg mb-2 last:mb-0 border',
                style.bg,
                style.border
              )}
            >
              <div className="flex items-start">
                <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', style.iconColor)} />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">{alert.title}</p>
                  <p className="text-xs text-secondary-600 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-secondary-400 mt-1">{alert.time}</p>
                </div>
                <button className="ml-2 text-secondary-400 hover:text-secondary-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
