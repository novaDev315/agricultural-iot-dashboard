'use client';

import { useState } from 'react';
import {
  Cpu,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Plus,
  MoreVertical,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Device {
  id: string;
  deviceId: string;
  name: string;
  type: 'sensor_node' | 'irrigation_controller' | 'weather_station' | 'gateway';
  status: 'online' | 'offline' | 'error';
  zone: string;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
  firmwareVersion: string;
  sensorsCount: number;
}

const mockDevices: Device[] = [
  { id: '1', deviceId: 'SNS-001', name: 'North Field Sensor', type: 'sensor_node', status: 'online', zone: 'North Field', batteryLevel: 85, signalStrength: 92, lastSeen: new Date(), firmwareVersion: '2.1.0', sensorsCount: 4 },
  { id: '2', deviceId: 'SNS-002', name: 'South Field Sensor', type: 'sensor_node', status: 'online', zone: 'South Field', batteryLevel: 72, signalStrength: 78, lastSeen: new Date(), firmwareVersion: '2.1.0', sensorsCount: 4 },
  { id: '3', deviceId: 'IRC-001', name: 'Irrigation Controller 1', type: 'irrigation_controller', status: 'online', zone: 'North Field', batteryLevel: 100, signalStrength: 95, lastSeen: new Date(), firmwareVersion: '3.0.2', sensorsCount: 2 },
  { id: '4', deviceId: 'SNS-003', name: 'Greenhouse Sensor', type: 'sensor_node', status: 'online', zone: 'Greenhouse', batteryLevel: 45, signalStrength: 88, lastSeen: new Date(), firmwareVersion: '2.0.8', sensorsCount: 6 },
  { id: '5', deviceId: 'WTH-001', name: 'Weather Station', type: 'weather_station', status: 'online', zone: 'Main', batteryLevel: 100, signalStrength: 99, lastSeen: new Date(), firmwareVersion: '1.5.0', sensorsCount: 8 },
  { id: '6', deviceId: 'SNS-004', name: 'West Field Sensor', type: 'sensor_node', status: 'offline', zone: 'West Field', batteryLevel: 12, signalStrength: 0, lastSeen: new Date(Date.now() - 3600000), firmwareVersion: '2.1.0', sensorsCount: 4 },
  { id: '7', deviceId: 'GW-001', name: 'Main Gateway', type: 'gateway', status: 'online', zone: 'Main', batteryLevel: 100, signalStrength: 100, lastSeen: new Date(), firmwareVersion: '4.2.1', sensorsCount: 0 },
  { id: '8', deviceId: 'SNS-005', name: 'East Plot Sensor', type: 'sensor_node', status: 'error', zone: 'East Plot', batteryLevel: 68, signalStrength: 45, lastSeen: new Date(Date.now() - 300000), firmwareVersion: '2.0.5', sensorsCount: 3 },
];

const deviceTypeLabels = {
  sensor_node: 'Sensor Node',
  irrigation_controller: 'Irrigation Controller',
  weather_station: 'Weather Station',
  gateway: 'Gateway',
};

export default function DevicesPage() {
  const [devices] = useState<Device[]>(mockDevices);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'error'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const filteredDevices = filter === 'all'
    ? devices
    : devices.filter(d => d.status === filter);

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    error: devices.filter(d => d.status === 'error').length,
    lowBattery: devices.filter(d => d.batteryLevel < 20).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Devices</h1>
          <p className="text-secondary-500">Manage and monitor all IoT devices</p>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 text-secondary-400 mr-2" />
            <span className="text-sm text-secondary-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-secondary-500">Online</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.online}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-secondary-400 mr-2" />
            <span className="text-sm text-secondary-500">Offline</span>
          </div>
          <p className="text-2xl font-bold text-secondary-600 mt-1">{stats.offline}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-secondary-500">Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.error}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <Battery className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-secondary-500">Low Battery</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.lowBattery}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        {(['all', 'online', 'offline', 'error'] as const).map((f) => (
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
          </button>
        ))}
      </div>

      {/* Device List */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Zone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Battery</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Signal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Last Seen</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {filteredDevices.map((device) => (
              <tr key={device.id} className="hover:bg-secondary-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                      device.status === 'online' ? 'bg-green-100' : device.status === 'error' ? 'bg-red-100' : 'bg-secondary-100'
                    )}>
                      <Cpu className={cn(
                        'h-5 w-5',
                        device.status === 'online' ? 'text-green-600' : device.status === 'error' ? 'text-red-600' : 'text-secondary-400'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{device.name}</p>
                      <p className="text-xs text-secondary-500">{device.deviceId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-secondary-600">
                  {deviceTypeLabels[device.type]}
                </td>
                <td className="px-4 py-4 text-sm text-secondary-600">{device.zone}</td>
                <td className="px-4 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    device.status === 'online' && 'bg-green-100 text-green-700',
                    device.status === 'offline' && 'bg-secondary-100 text-secondary-700',
                    device.status === 'error' && 'bg-red-100 text-red-700'
                  )}>
                    {device.status === 'online' && <Wifi className="h-3 w-3 mr-1" />}
                    {device.status === 'offline' && <WifiOff className="h-3 w-3 mr-1" />}
                    {device.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {device.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <Battery className={cn(
                      'h-4 w-4 mr-1',
                      device.batteryLevel > 50 ? 'text-green-500' : device.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                    )} />
                    <span className="text-sm text-secondary-600">{device.batteryLevel}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <Signal className="h-4 w-4 mr-1 text-secondary-400" />
                    <span className="text-sm text-secondary-600">{device.signalStrength}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-secondary-500">
                  {device.status === 'online' ? 'Just now' : new Date(device.lastSeen).toLocaleTimeString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-1">
                    <button className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-400">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-400">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-secondary-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
