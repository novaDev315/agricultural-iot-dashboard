'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  Bell,
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-secondary-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search sensors, zones, devices..."
              className="w-full pl-10 pr-4 py-2 bg-secondary-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-secondary-500 hover:bg-secondary-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100"
            >
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-secondary-700">
                {user?.firstName || 'User'}
              </span>
              <ChevronDown className="h-4 w-4 text-secondary-400" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-20">
                  <div className="px-4 py-3 border-b border-secondary-100">
                    <p className="text-sm font-medium text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    <Settings className="h-4 w-4 mr-3 text-secondary-400" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
