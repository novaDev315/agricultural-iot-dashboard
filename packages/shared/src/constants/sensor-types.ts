import { SensorType } from '../types/sensor';

export const SENSOR_TYPE_INFO: Record<SensorType, {
  name: string;
  description: string;
  icon: string;
  category: 'soil' | 'air' | 'water' | 'light' | 'plant';
  optimalRange?: { min: number; max: number };
}> = {
  [SensorType.SOIL_MOISTURE]: {
    name: 'Soil Moisture',
    description: 'Measures water content in soil',
    icon: 'droplet',
    category: 'soil',
    optimalRange: { min: 30, max: 70 },
  },
  [SensorType.SOIL_TEMPERATURE]: {
    name: 'Soil Temperature',
    description: 'Measures soil temperature at root level',
    icon: 'thermometer',
    category: 'soil',
    optimalRange: { min: 15, max: 25 },
  },
  [SensorType.SOIL_PH]: {
    name: 'Soil pH',
    description: 'Measures soil acidity/alkalinity',
    icon: 'flask',
    category: 'soil',
    optimalRange: { min: 6.0, max: 7.5 },
  },
  [SensorType.SOIL_EC]: {
    name: 'Electrical Conductivity',
    description: 'Measures soil salinity and nutrient levels',
    icon: 'zap',
    category: 'soil',
    optimalRange: { min: 0.5, max: 2.5 },
  },
  [SensorType.AIR_TEMPERATURE]: {
    name: 'Air Temperature',
    description: 'Measures ambient air temperature',
    icon: 'thermometer',
    category: 'air',
    optimalRange: { min: 18, max: 30 },
  },
  [SensorType.AIR_HUMIDITY]: {
    name: 'Air Humidity',
    description: 'Measures relative humidity',
    icon: 'cloud',
    category: 'air',
    optimalRange: { min: 40, max: 70 },
  },
  [SensorType.LIGHT_INTENSITY]: {
    name: 'Light Intensity',
    description: 'Measures ambient light in lux',
    icon: 'sun',
    category: 'light',
  },
  [SensorType.UV_INDEX]: {
    name: 'UV Index',
    description: 'Measures ultraviolet radiation',
    icon: 'sun',
    category: 'light',
  },
  [SensorType.WIND_SPEED]: {
    name: 'Wind Speed',
    description: 'Measures wind velocity',
    icon: 'wind',
    category: 'air',
  },
  [SensorType.WIND_DIRECTION]: {
    name: 'Wind Direction',
    description: 'Measures wind direction in degrees',
    icon: 'compass',
    category: 'air',
  },
  [SensorType.RAINFALL]: {
    name: 'Rainfall',
    description: 'Measures precipitation',
    icon: 'cloud-rain',
    category: 'water',
  },
  [SensorType.ATMOSPHERIC_PRESSURE]: {
    name: 'Atmospheric Pressure',
    description: 'Measures barometric pressure',
    icon: 'gauge',
    category: 'air',
  },
  [SensorType.CO2_LEVEL]: {
    name: 'CO2 Level',
    description: 'Measures carbon dioxide concentration',
    icon: 'cloud',
    category: 'air',
    optimalRange: { min: 400, max: 1000 },
  },
  [SensorType.LEAF_WETNESS]: {
    name: 'Leaf Wetness',
    description: 'Measures moisture on leaf surfaces',
    icon: 'leaf',
    category: 'plant',
  },
  [SensorType.WATER_LEVEL]: {
    name: 'Water Level',
    description: 'Measures water tank/reservoir level',
    icon: 'droplet',
    category: 'water',
  },
  [SensorType.WATER_FLOW]: {
    name: 'Water Flow',
    description: 'Measures water flow rate',
    icon: 'activity',
    category: 'water',
  },
  [SensorType.WATER_PRESSURE]: {
    name: 'Water Pressure',
    description: 'Measures water system pressure',
    icon: 'gauge',
    category: 'water',
  },
  [SensorType.NDVI]: {
    name: 'NDVI',
    description: 'Normalized Difference Vegetation Index',
    icon: 'leaf',
    category: 'plant',
    optimalRange: { min: 0.3, max: 0.8 },
  },
};

export const SENSOR_CATEGORIES = {
  soil: {
    name: 'Soil Sensors',
    description: 'Sensors for measuring soil conditions',
    types: [SensorType.SOIL_MOISTURE, SensorType.SOIL_TEMPERATURE, SensorType.SOIL_PH, SensorType.SOIL_EC],
  },
  air: {
    name: 'Air Sensors',
    description: 'Sensors for measuring atmospheric conditions',
    types: [SensorType.AIR_TEMPERATURE, SensorType.AIR_HUMIDITY, SensorType.WIND_SPEED, SensorType.WIND_DIRECTION, SensorType.ATMOSPHERIC_PRESSURE, SensorType.CO2_LEVEL],
  },
  water: {
    name: 'Water Sensors',
    description: 'Sensors for measuring water conditions',
    types: [SensorType.RAINFALL, SensorType.WATER_LEVEL, SensorType.WATER_FLOW, SensorType.WATER_PRESSURE],
  },
  light: {
    name: 'Light Sensors',
    description: 'Sensors for measuring light conditions',
    types: [SensorType.LIGHT_INTENSITY, SensorType.UV_INDEX],
  },
  plant: {
    name: 'Plant Sensors',
    description: 'Sensors for measuring plant health',
    types: [SensorType.LEAF_WETNESS, SensorType.NDVI],
  },
};
