export interface WeatherData {
  farmId: string;
  timestamp: Date;
  source: 'station' | 'api' | 'forecast';
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // m/s
  windDirection: number; // degrees
  windGust?: number; // m/s
  rainfall: number; // mm (last hour)
  rainfallDaily: number; // mm (today)
  uvIndex: number;
  visibility?: number; // km
  cloudCover?: number; // %
  dewPoint?: number; // °C
  description?: string;
  icon?: string;
}

export interface WeatherForecast {
  farmId: string;
  forecastTime: Date;
  generatedAt: Date;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  humidity: number;
  precipitationProbability: number; // %
  precipitationAmount: number; // mm
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  uvIndex: number;
  description: string;
  icon: string;
}

export interface DailyForecast {
  date: Date;
  temperatureMin: number;
  temperatureMax: number;
  humidity: number;
  precipitationProbability: number;
  precipitationAmount: number;
  windSpeed: number;
  windDirection: number;
  sunrise: Date;
  sunset: Date;
  uvIndexMax: number;
  description: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  type: 'frost' | 'heat' | 'storm' | 'wind' | 'flood' | 'drought' | 'hail';
  severity: 'advisory' | 'watch' | 'warning' | 'emergency';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  source: string;
}

export interface GrowingDegreeDays {
  farmId: string;
  date: Date;
  baseTemperature: number; // Base temp for crop type
  dailyGDD: number;
  cumulativeGDD: number;
  seasonStartDate: Date;
}

export interface EvapotranspirationData {
  farmId: string;
  date: Date;
  et0: number; // Reference evapotranspiration (mm/day)
  etc?: number; // Crop evapotranspiration (mm/day)
  cropCoefficient?: number;
  method: 'penman_monteith' | 'hargreaves' | 'blaney_criddle';
}

export interface WeatherStation {
  id: string;
  farmId: string;
  deviceId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  sensors: WeatherSensorConfig[];
  status: 'online' | 'offline' | 'error';
  lastReading?: Date;
}

export interface WeatherSensorConfig {
  type: 'temperature' | 'humidity' | 'pressure' | 'wind' | 'rain' | 'uv' | 'solar';
  enabled: boolean;
  calibrationOffset?: number;
}

export interface WeatherSummary {
  farmId: string;
  period: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: {
    min: number;
    max: number;
    avg: number;
  };
  totalRainfall: number;
  totalGDD: number;
  frostDays: number;
  heatStressDays: number; // Days above threshold
  windyDays: number;
}

export interface WeatherApiConfig {
  provider: 'openweather' | 'weatherapi' | 'tomorrow' | 'custom';
  apiKey: string;
  refreshIntervalMinutes: number;
  forecastDays: number;
}
