'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'cyan';
}

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    trend: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    trend: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    trend: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    icon: 'text-cyan-600',
    trend: 'text-cyan-600',
  },
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'green' }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary-100">
      <div className="flex items-center justify-between">
        <div className={cn('p-2.5 rounded-lg', colors.bg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-secondary-900">{value}</p>
        <p className="text-sm text-secondary-500 mt-1">{title}</p>
      </div>
    </div>
  );
}
