'use client';

import { useState } from 'react';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  MoreVertical,
  Clock,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutomationRuleBuilder } from '@/components/automation/rule-builder';

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
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Low Moisture Auto-Irrigation',
    description: 'Automatically start irrigation when soil moisture drops below 25%',
    isActive: true,
    trigger: { type: 'sensor_threshold', config: { sensorType: 'soil_moisture', threshold: 25, operator: 'less_than' } },
    conditions: [{ type: 'time_range', operator: 'between', value: { start: '06:00', end: '20:00' } }],
    actions: [{ type: 'irrigation_start', config: { zone: 'North Field', duration: 30 } }],
    lastTriggered: new Date(Date.now() - 7200000),
    triggerCount: 45,
    createdAt: new Date(Date.now() - 2592000000),
  },
  {
    id: '2',
    name: 'Frost Protection',
    description: 'Send alert when temperature drops below 2°C',
    isActive: true,
    trigger: { type: 'sensor_threshold', config: { sensorType: 'air_temperature', threshold: 2, operator: 'less_than' } },
    conditions: [],
    actions: [
      { type: 'alert', config: { severity: 'emergency', message: 'Frost warning activated' } },
      { type: 'notification', config: { channels: ['email', 'sms'] } },
    ],
    lastTriggered: new Date(Date.now() - 604800000),
    triggerCount: 3,
    createdAt: new Date(Date.now() - 5184000000),
  },
  {
    id: '3',
    name: 'Evening Irrigation Schedule',
    description: 'Run irrigation every evening at 6 PM for greenhouse',
    isActive: true,
    trigger: { type: 'schedule', config: { time: '18:00', days: ['Mon', 'Wed', 'Fri'] } },
    conditions: [{ type: 'weather', operator: 'not_equals', value: 'rainy' }],
    actions: [{ type: 'irrigation_start', config: { zone: 'Greenhouse', duration: 20 } }],
    lastTriggered: new Date(Date.now() - 86400000),
    triggerCount: 28,
    createdAt: new Date(Date.now() - 1728000000),
  },
  {
    id: '4',
    name: 'High Temperature Alert',
    description: 'Alert when greenhouse temperature exceeds 35°C',
    isActive: false,
    trigger: { type: 'sensor_threshold', config: { sensorType: 'air_temperature', threshold: 35, operator: 'greater_than' } },
    conditions: [{ type: 'zone', operator: 'equals', value: 'Greenhouse' }],
    actions: [{ type: 'alert', config: { severity: 'warning', message: 'High temperature in greenhouse' } }],
    lastTriggered: new Date(Date.now() - 172800000),
    triggerCount: 12,
    createdAt: new Date(Date.now() - 3456000000),
  },
  {
    id: '5',
    name: 'Rain Delay',
    description: 'Pause irrigation when rain is detected',
    isActive: true,
    trigger: { type: 'weather', config: { condition: 'rain', threshold: 5 } },
    conditions: [],
    actions: [{ type: 'irrigation_stop', config: { zones: 'all' } }],
    triggerCount: 8,
    createdAt: new Date(Date.now() - 1296000000),
  },
];

const triggerIcons = {
  sensor_threshold: Thermometer,
  schedule: Clock,
  weather: Sun,
  manual: Play,
};

const triggerLabels = {
  sensor_threshold: 'Sensor Threshold',
  schedule: 'Schedule',
  weather: 'Weather',
  manual: 'Manual',
};

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredRules = rules.filter((rule) => {
    if (filter === 'active') return rule.isActive;
    if (filter === 'inactive') return !rule.isActive;
    return true;
  });

  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.isActive).length,
    triggered24h: rules.filter((r) => r.lastTriggered && Date.now() - r.lastTriggered.getTime() < 86400000).length,
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowBuilder(true);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule(rule);
    setShowBuilder(true);
  };

  const handleSaveRule = (rule: Partial<AutomationRule>) => {
    if (editingRule) {
      setRules((prev) =>
        prev.map((r) => (r.id === editingRule.id ? { ...r, ...rule } : r))
      );
    } else {
      const newRule: AutomationRule = {
        id: Date.now().toString(),
        name: rule.name || 'New Rule',
        description: rule.description || '',
        isActive: true,
        trigger: rule.trigger || { type: 'sensor_threshold', config: {} },
        conditions: rule.conditions || [],
        actions: rule.actions || [],
        triggerCount: 0,
        createdAt: new Date(),
      };
      setRules((prev) => [newRule, ...prev]);
    }
    setShowBuilder(false);
    setEditingRule(null);
  };

  const formatLastTriggered = (date?: Date) => {
    if (!date) return 'Never';
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (showBuilder) {
    return (
      <AutomationRuleBuilder
        rule={editingRule}
        onSave={handleSaveRule}
        onCancel={() => {
          setShowBuilder(false);
          setEditingRule(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Automation</h1>
          <p className="text-secondary-500">Create and manage automation rules</p>
        </div>
        <button
          onClick={handleCreateRule}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-sm text-secondary-500">Total Rules</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-secondary-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm text-secondary-500">Triggered (24h)</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.triggered24h}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'active', 'inactive'] as const).map((f) => (
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

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => {
          const TriggerIcon = triggerIcons[rule.trigger.type];

          return (
            <div
              key={rule.id}
              className={cn(
                'bg-white rounded-xl p-5 shadow-sm border-2 transition-all',
                rule.isActive ? 'border-secondary-100' : 'border-secondary-100 opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mr-4',
                      rule.isActive ? 'bg-primary-100' : 'bg-secondary-100'
                    )}
                  >
                    <TriggerIcon
                      className={cn(
                        'h-5 w-5',
                        rule.isActive ? 'text-primary-600' : 'text-secondary-400'
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-secondary-900">{rule.name}</h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          rule.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-secondary-100 text-secondary-600'
                        )}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-500 mt-1">{rule.description}</p>

                    {/* Rule Flow Preview */}
                    <div className="flex items-center mt-3 text-sm">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                        {triggerLabels[rule.trigger.type]}
                      </span>
                      {rule.conditions.length > 0 && (
                        <>
                          <ChevronRight className="h-4 w-4 mx-1 text-secondary-400" />
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded">
                            {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                      <ChevronRight className="h-4 w-4 mx-1 text-secondary-400" />
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-xs text-secondary-500">
                      <span>Last triggered: {formatLastTriggered(rule.lastTriggered)}</span>
                      <span>Total triggers: {rule.triggerCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      rule.isActive
                        ? 'hover:bg-yellow-50 text-yellow-600'
                        : 'hover:bg-green-50 text-green-600'
                    )}
                    title={rule.isActive ? 'Pause' : 'Activate'}
                  >
                    {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-500"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-500"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-secondary-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
            <Zap className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-600">No automation rules found</p>
            <button
              onClick={handleCreateRule}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Create your first rule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
