'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  Droplets,
  Thermometer,
  Zap,
  Settings,
  Info,
  Clock,
  MoreVertical,
  Archive,
  Star,
  StarOff,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success' | 'system';
  category: 'sensors' | 'irrigation' | 'automation' | 'weather' | 'system' | 'device';
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Low Soil Moisture Alert',
    message: 'Soil moisture in North Field has dropped below 25%. Consider starting irrigation.',
    type: 'warning',
    category: 'sensors',
    isRead: false,
    isStarred: true,
    isArchived: false,
    timestamp: new Date(Date.now() - 300000),
    actionUrl: '/irrigation',
  },
  {
    id: '2',
    title: 'Irrigation Completed',
    message: 'Scheduled irrigation for Greenhouse has completed successfully. 120L water used.',
    type: 'success',
    category: 'irrigation',
    isRead: false,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    title: 'Automation Rule Triggered',
    message: 'Rule "Low Moisture Auto-Irrigation" was triggered for South Field.',
    type: 'info',
    category: 'automation',
    isRead: false,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 3600000),
    actionUrl: '/automation',
  },
  {
    id: '4',
    title: 'Weather Alert',
    message: 'Heavy rain expected in the next 24 hours. Irrigation schedules may be adjusted.',
    type: 'warning',
    category: 'weather',
    isRead: true,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 7200000),
    actionUrl: '/weather',
  },
  {
    id: '5',
    title: 'Device Offline',
    message: 'Sensor node SN-005 in East Plot has gone offline. Check connection.',
    type: 'alert',
    category: 'device',
    isRead: true,
    isStarred: true,
    isArchived: false,
    timestamp: new Date(Date.now() - 14400000),
    actionUrl: '/devices',
  },
  {
    id: '6',
    title: 'Weekly Report Ready',
    message: 'Your weekly sensor summary report is ready to download.',
    type: 'info',
    category: 'system',
    isRead: true,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 86400000),
    actionUrl: '/reports',
  },
  {
    id: '7',
    title: 'High Temperature Warning',
    message: 'Greenhouse temperature exceeded 35°C. Ventilation system activated.',
    type: 'warning',
    category: 'sensors',
    isRead: true,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: '8',
    title: 'System Update',
    message: 'Agricultural IoT Dashboard has been updated to version 2.1.0 with new features.',
    type: 'system',
    category: 'system',
    isRead: true,
    isStarred: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 259200000),
  },
];

const typeConfig = {
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { icon: Check, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  system: { icon: Settings, color: 'text-secondary-500', bg: 'bg-secondary-50', border: 'border-secondary-200' },
};

const categoryIcons = {
  sensors: Thermometer,
  irrigation: Droplets,
  automation: Zap,
  weather: Info,
  system: Settings,
  device: Settings,
};

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread' && n.isRead) return false;
    if (filter === 'starred' && !n.isStarred) return false;
    if (filter === 'archived' && !n.isArchived) return false;
    if (filter !== 'archived' && n.isArchived) return false;
    if (categoryFilter && n.category !== categoryFilter) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length;
  const starredCount = notifications.filter((n) => n.isStarred && !n.isArchived).length;

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
    );
  };

  const markAsUnread = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: false } : n))
    );
  };

  const toggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isStarred: !n.isStarred } : n))
    );
  };

  const archiveNotifications = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isArchived: true } : n))
    );
    setSelectedIds(new Set());
  };

  const deleteNotifications = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelectedIds(new Set());
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Notification Inbox</h1>
          <p className="text-secondary-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center px-3 py-2 text-sm font-medium text-secondary-600 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </button>
          <button className="p-2 text-secondary-600 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filter Tabs */}
        <div className="flex bg-secondary-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'starred', label: `Starred (${starredCount})` },
            { id: 'archived', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                filter === tab.id ? 'bg-white shadow-sm text-secondary-900' : 'text-secondary-600'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="appearance-none pl-4 pr-10 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Categories</option>
            <option value="sensors">Sensors</option>
            <option value="irrigation">Irrigation</option>
            <option value="automation">Automation</option>
            <option value="weather">Weather</option>
            <option value="device">Devices</option>
            <option value="system">System</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400 pointer-events-none" />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <span className="text-sm font-medium text-primary-700">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => markAsRead(Array.from(selectedIds))}
              className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-100 rounded"
            >
              Mark read
            </button>
            <button
              onClick={() => markAsUnread(Array.from(selectedIds))}
              className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-100 rounded"
            >
              Mark unread
            </button>
            <button
              onClick={() => archiveNotifications(Array.from(selectedIds))}
              className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-100 rounded"
            >
              <Archive className="h-4 w-4 inline mr-1" />
              Archive
            </button>
            <button
              onClick={() => deleteNotifications(Array.from(selectedIds))}
              className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-4 w-4 inline mr-1" />
              Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-sm text-primary-600 hover:text-primary-700"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        {/* Select All Header */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-b border-secondary-100 bg-secondary-50">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={selectAll}
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-secondary-600">
                Select all ({filteredNotifications.length})
              </span>
            </label>
          </div>
        )}

        {/* Notification Items */}
        <div className="divide-y divide-secondary-100">
          {filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type];
            const TypeIcon = config.icon;
            const CategoryIcon = categoryIcons[notification.category];

            return (
              <div
                key={notification.id}
                className={cn(
                  'p-4 flex items-start transition-colors hover:bg-secondary-50',
                  !notification.isRead && 'bg-blue-50/50'
                )}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.has(notification.id)}
                  onChange={() => toggleSelect(notification.id)}
                  className="h-4 w-4 mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />

                {/* Star */}
                <button
                  onClick={() => toggleStar(notification.id)}
                  className="ml-3 mt-0.5"
                >
                  {notification.isStarred ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4 text-secondary-300 hover:text-yellow-500" />
                  )}
                </button>

                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center ml-3', config.bg)}>
                  <TypeIcon className={cn('h-5 w-5', config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 ml-4 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={cn(
                        'text-sm',
                        !notification.isRead ? 'font-semibold text-secondary-900' : 'font-medium text-secondary-700'
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="flex items-center text-xs text-secondary-400">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {notification.category}
                        </span>
                        <span className="flex items-center text-xs text-secondary-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-4">
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary-500" title="Unread" />
                      )}
                      <button
                        onClick={() => notification.isRead ? markAsUnread([notification.id]) : markAsRead([notification.id])}
                        className="p-1.5 rounded hover:bg-secondary-100 text-secondary-400"
                        title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.isRead ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => archiveNotifications([notification.id])}
                        className="p-1.5 rounded hover:bg-secondary-100 text-secondary-400"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteNotifications([notification.id])}
                        className="p-1.5 rounded hover:bg-red-50 text-secondary-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="inline-block mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View details →
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : filter === 'starred'
                  ? 'No starred notifications'
                  : filter === 'archived'
                  ? 'No archived notifications'
                  : 'No notifications'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
