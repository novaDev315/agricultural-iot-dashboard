export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFarmAccess {
  userId: string;
  farmId: string;
  role: UserRole;
  permissions: Permission[];
  grantedBy: string;
  grantedAt: Date;
}

export enum Permission {
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_SENSORS = 'view_sensors',
  VIEW_ALERTS = 'view_alerts',
  MANAGE_ALERTS = 'manage_alerts',
  VIEW_IRRIGATION = 'view_irrigation',
  CONTROL_IRRIGATION = 'control_irrigation',
  VIEW_AUTOMATION = 'view_automation',
  MANAGE_AUTOMATION = 'manage_automation',
  VIEW_DEVICES = 'view_devices',
  MANAGE_DEVICES = 'manage_devices',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  MANAGE_USERS = 'manage_users',
  MANAGE_FARM = 'manage_farm',
  MANAGE_BILLING = 'manage_billing',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserProfile {
  user: User;
  farms: {
    farmId: string;
    farmName: string;
    role: UserRole;
  }[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  temperatureUnit: 'celsius' | 'fahrenheit';
  measurementUnit: 'metric' | 'imperial';
  dashboardLayout?: Record<string, unknown>;
  defaultFarmId?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string; // Hashed
  prefix: string; // First 8 chars for identification
  permissions: Permission[];
  expiresAt?: Date;
  lastUsed?: Date;
  createdAt: Date;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  language?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface InviteUserDto {
  email: string;
  farmId: string;
  role: UserRole;
  permissions?: Permission[];
}
