'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Droplets,
  Thermometer,
  Bell,
  Zap,
  BarChart3,
  Settings,
  Sprout,
  Map,
  Cpu,
  CloudSun,
  FileText,
  Inbox,
  Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sensors', href: '/sensors', icon: Thermometer },
  { name: 'Irrigation', href: '/irrigation', icon: Droplets },
  { name: 'Weather', href: '/weather', icon: CloudSun },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Automation', href: '/automation', icon: Zap },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Zones', href: '/zones', icon: Map },
  { name: 'Devices', href: '/devices', icon: Cpu },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-secondary-200">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-secondary-200">
          <Sprout className="h-8 w-8 text-primary-600" />
          <span className="ml-3 text-xl font-bold text-secondary-900">AgriIoT</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-4">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-600' : 'text-secondary-400'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Farm selector */}
        <div className="p-4 border-t border-secondary-200">
          <div className="bg-primary-50 rounded-lg p-3">
            <p className="text-xs text-primary-600 font-medium">Current Farm</p>
            <p className="text-sm font-semibold text-primary-800 truncate">Green Valley Farm</p>
            <p className="text-xs text-primary-600 mt-1">250 acres • 18 devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
