'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Wifi,
  Mail,
  Smartphone,
  Key,
  Save,
  ChevronRight,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSection {
  id: string;
  name: string;
  icon: typeof Settings;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: 'profile', name: 'Profile', icon: User, description: 'Manage your account settings' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Configure alert preferences' },
  { id: 'security', name: 'Security', icon: Shield, description: 'Password and authentication' },
  { id: 'appearance', name: 'Appearance', icon: Palette, description: 'Theme and display options' },
  { id: 'integrations', name: 'Integrations', icon: Globe, description: 'External services and APIs' },
  { id: 'data', name: 'Data & Storage', icon: Database, description: 'Data retention and backups' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    name: 'John Farmer',
    email: 'john@farm.com',
    phone: '+1 555 123 4567',
    timezone: 'America/New_York',
    language: 'en',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: true,
    criticalOnly: false,
    digestFrequency: 'daily',
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    showWeatherWidget: true,
    dashboardLayout: 'default',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Farm Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Farm Name</label>
                  <input
                    type="text"
                    defaultValue="Green Valley Farm"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                  <input
                    type="text"
                    defaultValue="123 Farm Road, Agricultural County"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Alert Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="font-medium text-secondary-900">Email Notifications</p>
                      <p className="text-sm text-secondary-500">Receive alerts via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      notifications.emailAlerts ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow transition-transform',
                      notifications.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="font-medium text-secondary-900">SMS Alerts</p>
                      <p className="text-sm text-secondary-500">Get text messages for urgent alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      notifications.smsAlerts ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow transition-transform',
                      notifications.smsAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="font-medium text-secondary-900">Push Notifications</p>
                      <p className="text-sm text-secondary-500">Browser and mobile push alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, pushAlerts: !notifications.pushAlerts })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      notifications.pushAlerts ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow transition-transform',
                      notifications.pushAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quiet Hours</h3>
              <p className="text-sm text-secondary-500 mb-4">Only critical alerts will be sent during quiet hours</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={notifications.quietHoursStart}
                    onChange={(e) => setNotifications({ ...notifications, quietHoursStart: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={notifications.quietHoursEnd}
                    onChange={(e) => setNotifications({ ...notifications, quietHoursEnd: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Digest Settings</h3>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Summary Frequency</label>
                <select
                  value={notifications.digestFrequency}
                  onChange={(e) => setNotifications({ ...notifications, digestFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="realtime">Real-time (No digest)</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                  Update Password
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Two-Factor Authentication</h3>
              <div className="p-4 bg-secondary-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900">2FA Status</p>
                    <p className="text-sm text-secondary-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                  Enable 2FA
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="p-4 bg-secondary-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">Current Session</p>
                    <p className="text-sm text-secondary-500">Chrome on Windows - Active now</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Current</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setAppearance({ ...appearance, theme })}
                    className={cn(
                      'p-4 rounded-lg border-2 text-center transition-all',
                      appearance.theme === theme
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    )}
                  >
                    {theme === 'light' && <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />}
                    {theme === 'dark' && <Moon className="h-6 w-6 mx-auto mb-2 text-secondary-600" />}
                    {theme === 'system' && <Settings className="h-6 w-6 mx-auto mb-2 text-secondary-500" />}
                    <p className="font-medium text-secondary-900 capitalize">{theme}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900">Compact Mode</p>
                    <p className="text-sm text-secondary-500">Reduce spacing and padding</p>
                  </div>
                  <button
                    onClick={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      appearance.compactMode ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow transition-transform',
                      appearance.compactMode ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900">Weather Widget</p>
                    <p className="text-sm text-secondary-500">Show weather on dashboard</p>
                  </div>
                  <button
                    onClick={() => setAppearance({ ...appearance, showWeatherWidget: !appearance.showWeatherWidget })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      appearance.showWeatherWidget ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow transition-transform',
                      appearance.showWeatherWidget ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Wifi className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Weather API</p>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                  </div>
                  <button className="text-sm text-secondary-500 hover:text-secondary-700">Configure</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">MQTT Broker</p>
                      <p className="text-sm text-green-600">Connected - 8 devices</p>
                    </div>
                  </div>
                  <button className="text-sm text-secondary-500 hover:text-secondary-700">Configure</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                      <Globe className="h-5 w-5 text-secondary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">External API</p>
                      <p className="text-sm text-secondary-500">Not configured</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Data Retention</h3>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Keep sensor data for</label>
                <select className="w-full max-w-xs px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Backup</h3>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-secondary-900">Automatic Backups</p>
                    <p className="text-sm text-secondary-500">Last backup: 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Enabled</span>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                  Create Manual Backup
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Storage Usage</h3>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-600">Used</span>
                  <span className="font-medium text-secondary-900">2.4 GB / 10 GB</span>
                </div>
                <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-primary-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-500">Manage your account and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all',
            saved
              ? 'bg-green-600 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          )}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {settingSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center p-3 rounded-lg text-left transition-colors',
                activeSection === section.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-secondary-50 text-secondary-600'
              )}
            >
              <section.icon className="h-5 w-5 mr-3" />
              <div className="flex-1">
                <p className="font-medium">{section.name}</p>
                <p className="text-xs text-secondary-500">{section.description}</p>
              </div>
              <ChevronRight className={cn('h-4 w-4', activeSection === section.id ? 'text-primary-600' : 'text-secondary-400')} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
