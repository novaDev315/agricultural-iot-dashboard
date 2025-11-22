import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FarmsService } from '../farms/farms.service';

interface WeatherData {
  farmId: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  rainfall: number;
  uvIndex: number;
  description: string;
  icon: string;
}

interface WeatherForecast {
  farmId: string;
  hourly: Array<{
    time: Date;
    temperature: number;
    humidity: number;
    precipitationProbability: number;
    description: string;
    icon: string;
  }>;
  daily: Array<{
    date: Date;
    temperatureMin: number;
    temperatureMax: number;
    precipitationProbability: number;
    description: string;
    icon: string;
  }>;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private weatherCache: Map<string, WeatherData> = new Map();
  private forecastCache: Map<string, WeatherForecast> = new Map();
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private farmsService: FarmsService,
  ) {
    this.apiKey = this.configService.get<string>('weather.apiKey') || '';
  }

  async getCurrentWeather(farmId: string, userId: string): Promise<WeatherData> {
    const farm = await this.farmsService.findOne(farmId, userId);

    // Check cache first
    const cached = this.weatherCache.get(farmId);
    if (cached && Date.now() - cached.timestamp.getTime() < 15 * 60 * 1000) {
      return cached;
    }

    // Fetch from API or generate mock data
    const weatherData = await this.fetchWeatherData(farm.latitude, farm.longitude, farmId);
    this.weatherCache.set(farmId, weatherData);

    return weatherData;
  }

  async getForecast(farmId: string, userId: string): Promise<WeatherForecast> {
    const farm = await this.farmsService.findOne(farmId, userId);

    // Check cache
    const cached = this.forecastCache.get(farmId);
    if (cached) {
      return cached;
    }

    const forecast = await this.fetchForecast(farm.latitude, farm.longitude, farmId);
    this.forecastCache.set(farmId, forecast);

    return forecast;
  }

  private async fetchWeatherData(lat: number, lng: number, farmId: string): Promise<WeatherData> {
    if (this.apiKey) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`,
        );
        const data = await response.json();

        return {
          farmId,
          timestamp: new Date(),
          temperature: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          windDirection: data.wind.deg || 0,
          rainfall: data.rain?.['1h'] || 0,
          uvIndex: data.uvi || 0,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        };
      } catch (error) {
        this.logger.error(`Failed to fetch weather data: ${error}`);
      }
    }

    // Return mock data if no API key or fetch failed
    return this.generateMockWeatherData(farmId);
  }

  private async fetchForecast(lat: number, lng: number, farmId: string): Promise<WeatherForecast> {
    // Generate mock forecast
    return this.generateMockForecast(farmId);
  }

  private generateMockWeatherData(farmId: string): WeatherData {
    const hour = new Date().getHours();
    const baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 8;

    return {
      farmId,
      timestamp: new Date(),
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: 45 + Math.random() * 30,
      pressure: 1013 + Math.random() * 20 - 10,
      windSpeed: 2 + Math.random() * 8,
      windDirection: Math.floor(Math.random() * 360),
      rainfall: Math.random() > 0.8 ? Math.random() * 5 : 0,
      uvIndex: hour >= 6 && hour <= 18 ? Math.floor(Math.random() * 8) + 1 : 0,
      description: 'Partly cloudy',
      icon: '02d',
    };
  }

  private generateMockForecast(farmId: string): WeatherForecast {
    const now = new Date();
    const hourly = [];
    const daily = [];

    // Generate 24 hours of forecast
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      const baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 8;

      hourly.push({
        time,
        temperature: Math.round(baseTemp * 10) / 10,
        humidity: 45 + Math.random() * 30,
        precipitationProbability: Math.floor(Math.random() * 40),
        description: 'Partly cloudy',
        icon: hour >= 6 && hour <= 18 ? '02d' : '02n',
      });
    }

    // Generate 7 days of forecast
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      date.setHours(0, 0, 0, 0);

      daily.push({
        date,
        temperatureMin: 15 + Math.random() * 5,
        temperatureMax: 25 + Math.random() * 8,
        precipitationProbability: Math.floor(Math.random() * 50),
        description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
      });
    }

    return { farmId, hourly, daily };
  }

  async getGrowingDegreeDays(farmId: string, userId: string, baseTemp = 10): Promise<{ date: Date; gdd: number; cumulative: number }[]> {
    await this.farmsService.findOne(farmId, userId);

    // Generate mock GDD data for last 30 days
    const result = [];
    let cumulative = 0;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const maxTemp = 25 + Math.random() * 10;
      const minTemp = 12 + Math.random() * 8;
      const avgTemp = (maxTemp + minTemp) / 2;
      const gdd = Math.max(0, avgTemp - baseTemp);
      cumulative += gdd;

      result.push({
        date,
        gdd: Math.round(gdd * 10) / 10,
        cumulative: Math.round(cumulative * 10) / 10,
      });
    }

    return result;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshWeatherData() {
    this.logger.log('Refreshing weather data cache');
    // Clear old cache entries
    const now = Date.now();
    this.weatherCache.forEach((data, key) => {
      if (now - data.timestamp.getTime() > 60 * 60 * 1000) {
        this.weatherCache.delete(key);
      }
    });
  }
}
