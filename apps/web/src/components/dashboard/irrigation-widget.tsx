'use client';

import { Droplets, Play, Pause, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const zones = [
  { id: '1', name: 'North Field', status: 'running', progress: 65, duration: 30 },
  { id: '2', name: 'South Field', status: 'scheduled', nextRun: '14:00' },
  { id: '3', name: 'Greenhouse', status: 'idle', lastRun: '2h ago' },
];

export function IrrigationWidget() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
      <div className="p-4 border-b border-secondary-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-secondary-900">Irrigation Status</h3>
          <p className="text-xs text-secondary-500">3 zones configured</p>
        </div>
        <Droplets className="h-5 w-5 text-blue-500" />
      </div>
      <div className="p-2">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="p-3 rounded-lg mb-2 last:mb-0 bg-secondary-50"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-secondary-900">{zone.name}</p>
              {zone.status === 'running' && (
                <span className="flex items-center text-xs font-medium text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  Running
                </span>
              )}
              {zone.status === 'scheduled' && (
                <span className="flex items-center text-xs font-medium text-blue-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {zone.nextRun}
                </span>
              )}
              {zone.status === 'idle' && (
                <span className="text-xs text-secondary-500">{zone.lastRun}</span>
              )}
            </div>

            {zone.status === 'running' && (
              <>
                <div className="w-full bg-secondary-200 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${zone.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary-500">{zone.progress}% complete</span>
                  <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200">
                    <Pause className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}

            {zone.status === 'idle' && (
              <button className="w-full py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 flex items-center justify-center">
                <Play className="h-3 w-3 mr-1" />
                Start Irrigation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
