export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  location: GeoLocation;
  address?: string;
  areaAcres: number;
  timezone: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface Zone {
  id: string;
  farmId: string;
  name: string;
  description?: string;
  polygon: GeoPolygon;
  areaAcres: number;
  cropType?: string;
  soilType?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  irrigationSystemId?: string;
  color?: string; // For map visualization
  createdAt: Date;
  updatedAt: Date;
}

export interface GeoPolygon {
  coordinates: GeoLocation[];
}

export interface FarmStats {
  farmId: string;
  totalZones: number;
  totalDevices: number;
  totalSensors: number;
  activeAlerts: number;
  irrigationSystemsCount: number;
  totalWaterUsedToday: number; // in liters
  lastUpdated: Date;
}

export interface FarmSummary {
  farm: Farm;
  zones: Zone[];
  stats: FarmStats;
  recentAlerts: number;
  healthScore: number; // 0-100
}

export enum CropType {
  WHEAT = 'wheat',
  CORN = 'corn',
  SOYBEANS = 'soybeans',
  RICE = 'rice',
  COTTON = 'cotton',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  GRAPES = 'grapes',
  TOMATOES = 'tomatoes',
  LETTUCE = 'lettuce',
  STRAWBERRIES = 'strawberries',
  PEPPERS = 'peppers',
  CANNABIS = 'cannabis',
  HERBS = 'herbs',
  FLOWERS = 'flowers',
  OTHER = 'other',
}

export enum SoilType {
  SANDY = 'sandy',
  CLAY = 'clay',
  LOAMY = 'loamy',
  SILTY = 'silty',
  PEATY = 'peaty',
  CHALKY = 'chalky',
  SALINE = 'saline',
}

export interface CreateFarmDto {
  name: string;
  description?: string;
  location: GeoLocation;
  address?: string;
  areaAcres: number;
  timezone: string;
}

export interface CreateZoneDto {
  farmId: string;
  name: string;
  description?: string;
  polygon: GeoPolygon;
  areaAcres: number;
  cropType?: string;
  soilType?: string;
  color?: string;
}
