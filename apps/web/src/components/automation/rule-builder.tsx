'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Play,
  AlertTriangle,
  Bell,
  ChevronDown,
  GripVertical,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: {
    type: 'sensor_threshold' | 'schedule' | 'weather' | 'manual';
    config: Record<string, unknown>;
  };
  conditions: Array<{
    type: string;
    operator: string;
    value: unknown;
  }>;
  actions: Array<{
    type: 'irrigation_start' | 'irrigation_stop' | 'alert' | 'notification';
    config: Record<string, unknown>;
  }>;
}

interface RuleBuilderProps {
  rule: AutomationRule | null;
  onSave: (rule: Partial<AutomationRule>) => void;
  onCancel: () => void;
}

const triggerTypes = [
  { id: 'sensor_threshold', name: 'Sensor Threshold', icon: Thermometer, description: 'When sensor value crosses threshold' },
  { id: 'schedule', name: 'Schedule', icon: Clock, description: 'At specific times or intervals' },
  { id: 'weather', name: 'Weather Condition', icon: Sun, description: 'Based on weather forecast' },
  { id: 'manual', name: 'Manual Trigger', icon: Play, description: 'Triggered manually by user' },
];

const sensorTypes = [
  { id: 'soil_moisture', name: 'Soil Moisture', unit: '%' },
  { id: 'air_temperature', name: 'Air Temperature', unit: '°C' },
  { id: 'air_humidity', name: 'Air Humidity', unit: '%' },
  { id: 'soil_temperature', name: 'Soil Temperature', unit: '°C' },
  { id: 'light_intensity', name: 'Light Intensity', unit: 'lux' },
  { id: 'wind_speed', name: 'Wind Speed', unit: 'km/h' },
];

const operators = [
  { id: 'less_than', name: 'Less than', symbol: '<' },
  { id: 'less_equal', name: 'Less than or equal', symbol: '≤' },
  { id: 'greater_than', name: 'Greater than', symbol: '>' },
  { id: 'greater_equal', name: 'Greater than or equal', symbol: '≥' },
  { id: 'equals', name: 'Equals', symbol: '=' },
];

const actionTypes = [
  { id: 'irrigation_start', name: 'Start Irrigation', icon: Droplets, color: 'blue' },
  { id: 'irrigation_stop', name: 'Stop Irrigation', icon: Droplets, color: 'red' },
  { id: 'alert', name: 'Create Alert', icon: AlertTriangle, color: 'yellow' },
  { id: 'notification', name: 'Send Notification', icon: Bell, color: 'purple' },
];

const zones = ['North Field', 'South Field', 'East Plot', 'West Field', 'Greenhouse'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function AutomationRuleBuilder({ rule, onSave, onCancel }: RuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [triggerType, setTriggerType] = useState(rule?.trigger.type || 'sensor_threshold');
  const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>(
    rule?.trigger.config || { sensorType: 'soil_moisture', operator: 'less_than', threshold: 25 }
  );
  const [conditions, setConditions] = useState(rule?.conditions || []);
  const [actions, setActions] = useState(rule?.actions || []);

  const addCondition = () => {
    setConditions([...conditions, { type: 'time_range', operator: 'between', value: { start: '06:00', end: '20:00' } }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const addAction = (type: string) => {
    const defaultConfigs: Record<string, Record<string, unknown>> = {
      irrigation_start: { zone: 'North Field', duration: 30 },
      irrigation_stop: { zones: 'all' },
      alert: { severity: 'warning', message: '' },
      notification: { channels: ['email'] },
    };
    setActions([...actions, { type: type as 'irrigation_start' | 'irrigation_stop' | 'alert' | 'notification', config: defaultConfigs[type] || {} }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, config: Record<string, unknown>) => {
    setActions(actions.map((a, i) => (i === index ? { ...a, config: { ...a.config, ...config } } : a)));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      trigger: { type: triggerType, config: triggerConfig },
      conditions,
      actions,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onCancel} className="p-2 mr-2 rounded-lg hover:bg-secondary-100">
            <ArrowLeft className="h-5 w-5 text-secondary-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {rule ? 'Edit Rule' : 'Create Automation Rule'}
            </h1>
            <p className="text-secondary-500">Define triggers, conditions, and actions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || actions.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Rule
          </button>
        </div>
      </div>

      {/* Rule Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Rule Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Rule Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Low Moisture Auto-Irrigation"
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this rule does..."
              rows={2}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Trigger */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mr-2">1</span>
          When (Trigger)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {triggerTypes.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() => setTriggerType(trigger.id as typeof triggerType)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                triggerType === trigger.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 hover:border-secondary-300'
              )}
            >
              <trigger.icon className={cn('h-5 w-5 mb-2', triggerType === trigger.id ? 'text-primary-600' : 'text-secondary-400')} />
              <p className="font-medium text-secondary-900">{trigger.name}</p>
              <p className="text-xs text-secondary-500 mt-1">{trigger.description}</p>
            </button>
          ))}
        </div>

        {/* Trigger Config */}
        {triggerType === 'sensor_threshold' && (
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Sensor Type</label>
                <select
                  value={(triggerConfig.sensorType as string) || ''}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, sensorType: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {sensorTypes.map((sensor) => (
                    <option key={sensor.id} value={sensor.id}>{sensor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Operator</label>
                <select
                  value={(triggerConfig.operator as string) || ''}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, operator: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>{op.name} ({op.symbol})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Threshold ({sensorTypes.find((s) => s.id === triggerConfig.sensorType)?.unit || ''})
                </label>
                <input
                  type="number"
                  value={(triggerConfig.threshold as number) || 0}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, threshold: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {triggerType === 'schedule' && (
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Time</label>
                <input
                  type="time"
                  value={(triggerConfig.time as string) || '18:00'}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, time: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        const currentDays = (triggerConfig.days as string[]) || [];
                        if (currentDays.includes(day)) {
                          setTriggerConfig({ ...triggerConfig, days: currentDays.filter((d) => d !== day) });
                        } else {
                          setTriggerConfig({ ...triggerConfig, days: [...currentDays, day] });
                        }
                      }}
                      className={cn(
                        'px-3 py-1 text-sm rounded-full border transition-colors',
                        ((triggerConfig.days as string[]) || []).includes(day)
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-white border-secondary-200 text-secondary-600 hover:border-secondary-300'
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {triggerType === 'weather' && (
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Weather Condition</label>
                <select
                  value={(triggerConfig.condition as string) || ''}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rain">Rain Detected</option>
                  <option value="frost">Frost Warning</option>
                  <option value="heat">High Heat</option>
                  <option value="wind">High Wind</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Threshold (mm/h for rain)</label>
                <input
                  type="number"
                  value={(triggerConfig.threshold as number) || 5}
                  onChange={(e) => setTriggerConfig({ ...triggerConfig, threshold: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 text-sm font-bold mr-2">2</span>
            If (Conditions) <span className="text-sm font-normal text-secondary-500">- Optional</span>
          </h2>
          <button
            onClick={addCondition}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Condition
          </button>
        </div>

        {conditions.length === 0 ? (
          <div className="text-center py-8 bg-secondary-50 rounded-lg">
            <p className="text-secondary-500">No conditions added. Rule will execute whenever triggered.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center bg-secondary-50 rounded-lg p-3">
                <GripVertical className="h-4 w-4 text-secondary-400 mr-2 cursor-move" />
                <select
                  value={condition.type}
                  onChange={(e) => {
                    const updated = [...conditions];
                    updated[index] = { ...condition, type: e.target.value };
                    setConditions(updated);
                  }}
                  className="px-3 py-1.5 border border-secondary-200 rounded-lg text-sm mr-2"
                >
                  <option value="time_range">Time Range</option>
                  <option value="zone">Zone</option>
                  <option value="weather">Weather</option>
                  <option value="sensor">Sensor Value</option>
                </select>
                <select
                  value={condition.operator}
                  className="px-3 py-1.5 border border-secondary-200 rounded-lg text-sm mr-2"
                >
                  <option value="between">between</option>
                  <option value="equals">equals</option>
                  <option value="not_equals">not equals</option>
                </select>
                <input
                  type="text"
                  value={typeof condition.value === 'object' ? JSON.stringify(condition.value) : String(condition.value)}
                  className="flex-1 px-3 py-1.5 border border-secondary-200 rounded-lg text-sm mr-2"
                  placeholder="Value"
                />
                <button
                  onClick={() => removeCondition(index)}
                  className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-bold mr-2">3</span>
            Then (Actions)
          </h2>
        </div>

        {/* Action Type Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {actionTypes.map((action) => (
            <button
              key={action.id}
              onClick={() => addAction(action.id)}
              className="p-3 rounded-lg border-2 border-dashed border-secondary-200 hover:border-primary-300 hover:bg-primary-50 text-left transition-all"
            >
              <action.icon className="h-5 w-5 text-secondary-400 mb-1" />
              <p className="text-sm font-medium text-secondary-700">{action.name}</p>
            </button>
          ))}
        </div>

        {/* Added Actions */}
        {actions.length === 0 ? (
          <div className="text-center py-8 bg-secondary-50 rounded-lg">
            <Zap className="h-8 w-8 text-secondary-300 mx-auto mb-2" />
            <p className="text-secondary-500">Add at least one action to complete the rule</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action, index) => {
              const actionType = actionTypes.find((a) => a.id === action.type);
              const ActionIcon = actionType?.icon || Zap;

              return (
                <div key={index} className="bg-secondary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <ActionIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium text-secondary-900">{actionType?.name}</span>
                    </div>
                    <button
                      onClick={() => removeAction(index)}
                      className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {action.type === 'irrigation_start' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Zone</label>
                        <select
                          value={(action.config.zone as string) || ''}
                          onChange={(e) => updateAction(index, { zone: e.target.value })}
                          className="w-full px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
                        >
                          {zones.map((zone) => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          value={(action.config.duration as number) || 30}
                          onChange={(e) => updateAction(index, { duration: parseInt(e.target.value) })}
                          className="w-full px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {action.type === 'alert' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Severity</label>
                        <select
                          value={(action.config.severity as string) || 'warning'}
                          onChange={(e) => updateAction(index, { severity: e.target.value })}
                          className="w-full px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="critical">Critical</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Message</label>
                        <input
                          type="text"
                          value={(action.config.message as string) || ''}
                          onChange={(e) => updateAction(index, { message: e.target.value })}
                          placeholder="Alert message..."
                          className="w-full px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {action.type === 'notification' && (
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Channels</label>
                      <div className="flex gap-2">
                        {['email', 'sms', 'push'].map((channel) => (
                          <button
                            key={channel}
                            onClick={() => {
                              const channels = (action.config.channels as string[]) || [];
                              if (channels.includes(channel)) {
                                updateAction(index, { channels: channels.filter((c) => c !== channel) });
                              } else {
                                updateAction(index, { channels: [...channels, channel] });
                              }
                            }}
                            className={cn(
                              'px-3 py-1 text-sm rounded-full border transition-colors',
                              ((action.config.channels as string[]) || []).includes(channel)
                                ? 'bg-primary-100 border-primary-300 text-primary-700'
                                : 'bg-white border-secondary-200 text-secondary-600'
                            )}
                          >
                            {channel.charAt(0).toUpperCase() + channel.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {action.type === 'irrigation_stop' && (
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Zones</label>
                      <select
                        value={(action.config.zones as string) || 'all'}
                        onChange={(e) => updateAction(index, { zones: e.target.value })}
                        className="w-full px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
                      >
                        <option value="all">All Zones</option>
                        {zones.map((zone) => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
