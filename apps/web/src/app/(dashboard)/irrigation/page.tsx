'use client';

import { useState } from 'react';
import {
  Droplets,
  Play,
  Pause,
  Clock,
  Calendar,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Timer,
  Gauge,
  Power,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IrrigationZone {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'scheduled' | 'error';
  currentMoisture: number;
  targetMoisture: number;
  lastIrrigated?: Date;
  nextScheduled?: Date;
  waterUsedToday: number;
  valveStatus: 'open' | 'closed';
  duration?: number;
  progress?: number;
}

interface Schedule {
  id: string;
  name: string;
  zones: string[];
  days: string[];
  startTime: string;
  duration: number;
  isActive: boolean;
}

const mockZones: IrrigationZone[] = [
  { id: '1', name: 'North Field', status: 'running', currentMoisture: 32, targetMoisture: 45, lastIrrigated: new Date(Date.now() - 86400000), waterUsedToday: 450, valveStatus: 'open', duration: 30, progress: 65 },
  { id: '2', name: 'South Field', status: 'scheduled', currentMoisture: 28, targetMoisture: 40, lastIrrigated: new Date(Date.now() - 172800000), nextScheduled: new Date(Date.now() + 7200000), waterUsedToday: 0, valveStatus: 'closed' },
  { id: '3', name: 'East Plot', status: 'idle', currentMoisture: 52, targetMoisture: 45, lastIrrigated: new Date(Date.now() - 43200000), waterUsedToday: 280, valveStatus: 'closed' },
  { id: '4', name: 'Greenhouse', status: 'idle', currentMoisture: 61, targetMoisture: 55, lastIrrigated: new Date(Date.now() - 21600000), waterUsedToday: 120, valveStatus: 'closed' },
  { id: '5', name: 'West Field', status: 'error', currentMoisture: 18, targetMoisture: 40, lastIrrigated: new Date(Date.now() - 259200000), waterUsedToday: 0, valveStatus: 'closed' },
];

const mockSchedules: Schedule[] = [
  { id: '1', name: 'Morning Irrigation', zones: ['North Field', 'South Field'], days: ['Mon', 'Wed', 'Fri'], startTime: '06:00', duration: 30, isActive: true },
  { id: '2', name: 'Evening Greenhouse', zones: ['Greenhouse'], days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '18:00', duration: 20, isActive: true },
  { id: '3', name: 'Weekend Deep Water', zones: ['East Plot', 'West Field'], days: ['Sat', 'Sun'], startTime: '07:00', duration: 45, isActive: false },
];

const statusConfig = {
  idle: { label: 'Idle', color: 'text-secondary-600', bg: 'bg-secondary-100', icon: Power },
  running: { label: 'Running', color: 'text-blue-600', bg: 'bg-blue-100', icon: Droplets },
  scheduled: { label: 'Scheduled', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
  error: { label: 'Error', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle },
};

export default function IrrigationPage() {
  const [zones, setZones] = useState<IrrigationZone[]>(mockZones);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [view, setView] = useState<'zones' | 'schedules'>('zones');

  const stats = {
    running: zones.filter((z) => z.status === 'running').length,
    scheduled: zones.filter((z) => z.status === 'scheduled').length,
    waterToday: zones.reduce((sum, z) => sum + z.waterUsedToday, 0),
    errors: zones.filter((z) => z.status === 'error').length,
  };

  const toggleZone = (id: string) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== id) return zone;
        if (zone.status === 'running') {
          return { ...zone, status: 'idle' as const, valveStatus: 'closed' as const, progress: undefined, duration: undefined };
        } else if (zone.status !== 'error') {
          return { ...zone, status: 'running' as const, valveStatus: 'open' as const, progress: 0, duration: 30 };
        }
        return zone;
      })
    );
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'N/A';
    const now = Date.now();
    const diff = date.getTime() - now;
    if (diff > 0) {
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return `in ${hours}h ${mins}m`;
    }
    const pastDiff = now - date.getTime();
    if (pastDiff < 3600000) return `${Math.floor(pastDiff / 60000)}m ago`;
    if (pastDiff < 86400000) return `${Math.floor(pastDiff / 3600000)}h ago`;
    return `${Math.floor(pastDiff / 86400000)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Irrigation</h1>
          <p className="text-secondary-500">Control and schedule irrigation systems</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setView('zones')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'zones' ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
              )}
            >
              Zones
            </button>
            <button
              onClick={() => setView('schedules')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'schedules' ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
              )}
            >
              Schedules
            </button>
          </div>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            {view === 'zones' ? 'Add Zone' : 'Create Schedule'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <Droplets className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              <p className="text-sm text-secondary-500">Running</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
              <p className="text-sm text-secondary-500">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
              <Gauge className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.waterToday}L</p>
              <p className="text-sm text-secondary-500">Used Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              <p className="text-sm text-secondary-500">Errors</p>
            </div>
          </div>
        </div>
      </div>

      {view === 'zones' ? (
        /* Zone Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const config = statusConfig[zone.status];
            const StatusIcon = config.icon;
            const moisturePercent = (zone.currentMoisture / zone.targetMoisture) * 100;
            const needsWater = zone.currentMoisture < zone.targetMoisture;

            return (
              <div key={zone.id} className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
                {/* Status Bar */}
                <div className={cn('h-1', zone.status === 'running' ? 'bg-blue-500' : zone.status === 'error' ? 'bg-red-500' : 'bg-secondary-200')} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-secondary-900">{zone.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.color)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleZone(zone.id)}
                      disabled={zone.status === 'error'}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        zone.status === 'running'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : zone.status === 'error'
                          ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      )}
                    >
                      {zone.status === 'running' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Progress (if running) */}
                  {zone.status === 'running' && zone.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-500">Progress</span>
                        <span className="font-medium text-secondary-900">{zone.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${zone.progress}%` }} />
                      </div>
                      <p className="text-xs text-secondary-500 mt-1">{Math.round((zone.duration || 30) * (1 - (zone.progress || 0) / 100))} min remaining</p>
                    </div>
                  )}

                  {/* Moisture */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary-500">Soil Moisture</span>
                      <span className={cn('font-medium', needsWater ? 'text-orange-600' : 'text-green-600')}>
                        {zone.currentMoisture}% / {zone.targetMoisture}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', needsWater ? 'bg-orange-500' : 'bg-green-500')}
                        style={{ width: `${Math.min(moisturePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-500">Last Irrigated</p>
                      <p className="font-medium text-secondary-900">{formatTime(zone.lastIrrigated)}</p>
                    </div>
                    <div>
                      <p className="text-secondary-500">Water Today</p>
                      <p className="font-medium text-secondary-900">{zone.waterUsedToday}L</p>
                    </div>
                  </div>

                  {zone.status === 'scheduled' && zone.nextScheduled && (
                    <div className="mt-3 pt-3 border-t border-secondary-100">
                      <p className="text-sm text-secondary-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Next: {formatTime(zone.nextScheduled)}
                      </p>
                    </div>
                  )}

                  {zone.status === 'error' && (
                    <div className="mt-3 pt-3 border-t border-red-100 bg-red-50 -mx-5 -mb-5 px-5 py-3">
                      <p className="text-sm text-red-700">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Valve malfunction detected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Schedules */
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                'bg-white rounded-xl p-5 shadow-sm border-2 transition-all',
                schedule.isActive ? 'border-secondary-100' : 'border-secondary-100 opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mr-4', schedule.isActive ? 'bg-primary-100' : 'bg-secondary-100')}>
                    <Calendar className={cn('h-5 w-5', schedule.isActive ? 'text-primary-600' : 'text-secondary-400')} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-secondary-900">{schedule.name}</h3>
                      <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', schedule.isActive ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600')}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-secondary-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-secondary-400" />
                        {schedule.startTime} ({schedule.duration} min)
                      </span>
                      <span className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1 text-secondary-400" />
                        {schedule.zones.join(', ')}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span
                          key={day}
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                            schedule.days.includes(day) ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-400'
                          )}
                        >
                          {day.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-secondary-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {schedules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
              <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">No schedules created</p>
              <button className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                Create your first schedule
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
