'use client';

import { useState } from 'react';
import { useFarmStore } from '@/stores/farm-store';
import {
  Map,
  Plus,
  Leaf,
  Droplets,
  Thermometer,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZoneMap } from '@/components/zones/zone-map';
import { CreateZoneModal } from '@/components/zones/create-zone-modal';

interface Zone {
  id: string;
  name: string;
  areaAcres: number;
  cropType: string;
  soilType: string;
  color: string;
  sensors: number;
  moisture: number;
  temperature: number;
  status: 'healthy' | 'warning' | 'critical';
}

const mockZones: Zone[] = [
  { id: '1', name: 'North Field', areaAcres: 45, cropType: 'Corn', soilType: 'Loamy', color: '#22c55e', sensors: 5, moisture: 42, temperature: 24, status: 'healthy' },
  { id: '2', name: 'South Field', areaAcres: 38, cropType: 'Wheat', soilType: 'Clay', color: '#3b82f6', sensors: 4, moisture: 28, temperature: 26, status: 'warning' },
  { id: '3', name: 'East Plot', areaAcres: 22, cropType: 'Soybeans', soilType: 'Sandy', color: '#f59e0b', sensors: 3, moisture: 55, temperature: 23, status: 'healthy' },
  { id: '4', name: 'Greenhouse A', areaAcres: 2, cropType: 'Tomatoes', soilType: 'Loamy', color: '#ec4899', sensors: 8, moisture: 65, temperature: 28, status: 'healthy' },
  { id: '5', name: 'West Field', areaAcres: 52, cropType: 'Cotton', soilType: 'Silty', color: '#8b5cf6', sensors: 6, moisture: 18, temperature: 27, status: 'critical' },
];

export default function ZonesPage() {
  const { currentFarm } = useFarmStore();
  const [zones] = useState<Zone[]>(mockZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const totalAcres = zones.reduce((sum, z) => sum + z.areaAcres, 0);
  const totalSensors = zones.reduce((sum, z) => sum + z.sensors, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Zones</h1>
          <p className="text-secondary-500">
            Manage {zones.length} zones across {totalAcres} acres
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'grid' ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
              )}
            >
              Grid
            </button>
            <button
              onClick={() => setView('map')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'map' ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
              )}
            >
              Map
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <p className="text-sm text-secondary-500">Total Zones</p>
          <p className="text-2xl font-bold text-secondary-900">{zones.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <p className="text-sm text-secondary-500">Total Area</p>
          <p className="text-2xl font-bold text-secondary-900">{totalAcres} acres</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <p className="text-sm text-secondary-500">Active Sensors</p>
          <p className="text-2xl font-bold text-secondary-900">{totalSensors}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <p className="text-sm text-secondary-500">Zones Needing Attention</p>
          <p className="text-2xl font-bold text-orange-600">
            {zones.filter((z) => z.status !== 'healthy').length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={cn(
                'bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md',
                selectedZone?.id === zone.id ? 'border-primary-500' : 'border-secondary-100'
              )}
              onClick={() => setSelectedZone(zone)}
            >
              {/* Color bar */}
              <div className="h-2" style={{ backgroundColor: zone.color }} />

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{zone.name}</h3>
                    <p className="text-sm text-secondary-500">{zone.areaAcres} acres</p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      zone.status === 'healthy' && 'bg-green-100 text-green-700',
                      zone.status === 'warning' && 'bg-yellow-100 text-yellow-700',
                      zone.status === 'critical' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center text-sm">
                    <Leaf className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-secondary-600">{zone.cropType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Map className="h-4 w-4 text-secondary-400 mr-2" />
                    <span className="text-secondary-600">{zone.soilType}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-100 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-secondary-500">
                      <Droplets className="h-4 w-4 mr-1" />
                      Moisture
                    </div>
                    <p className="text-lg font-semibold text-secondary-900">{zone.moisture}%</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-secondary-500">
                      <Thermometer className="h-4 w-4 mr-1" />
                      Temp
                    </div>
                    <p className="text-lg font-semibold text-secondary-900">{zone.temperature}°C</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-secondary-500">{zone.sensors} sensors</span>
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-400 hover:text-secondary-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-400 hover:text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-secondary-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ZoneMap zones={zones} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
      )}

      {showCreateModal && (
        <CreateZoneModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
