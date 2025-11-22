'use client';

import { useState } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudSnow,
  CloudLightning,
  Calendar,
  MapPin,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HourlyForecast {
  time: string;
  temp: number;
  icon: typeof Sun;
  precipitation: number;
}

interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  icon: typeof Sun;
  precipitation: number;
  description: string;
}

const currentWeather = {
  temperature: 24,
  feelsLike: 26,
  condition: 'Partly Cloudy',
  icon: Cloud,
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NW',
  visibility: 10,
  pressure: 1015,
  uvIndex: 6,
  dewPoint: 17,
  sunrise: '06:23',
  sunset: '18:45',
};

const hourlyForecast: HourlyForecast[] = [
  { time: 'Now', temp: 24, icon: Cloud, precipitation: 0 },
  { time: '2PM', temp: 26, icon: Sun, precipitation: 0 },
  { time: '3PM', temp: 27, icon: Sun, precipitation: 0 },
  { time: '4PM', temp: 26, icon: Cloud, precipitation: 10 },
  { time: '5PM', temp: 24, icon: CloudRain, precipitation: 40 },
  { time: '6PM', temp: 22, icon: CloudRain, precipitation: 60 },
  { time: '7PM', temp: 20, icon: Cloud, precipitation: 20 },
  { time: '8PM', temp: 19, icon: Cloud, precipitation: 5 },
];

const dailyForecast: DailyForecast[] = [
  { day: 'Today', date: 'Nov 22', high: 27, low: 18, icon: Cloud, precipitation: 30, description: 'Partly cloudy, afternoon showers' },
  { day: 'Sat', date: 'Nov 23', high: 25, low: 16, icon: CloudRain, precipitation: 70, description: 'Rain likely throughout the day' },
  { day: 'Sun', date: 'Nov 24', high: 22, low: 14, icon: CloudRain, precipitation: 80, description: 'Heavy rain expected' },
  { day: 'Mon', date: 'Nov 25', high: 24, low: 15, icon: Cloud, precipitation: 20, description: 'Clearing, partly cloudy' },
  { day: 'Tue', date: 'Nov 26', high: 26, low: 17, icon: Sun, precipitation: 5, description: 'Sunny and warm' },
  { day: 'Wed', date: 'Nov 27', high: 28, low: 18, icon: Sun, precipitation: 0, description: 'Clear skies' },
  { day: 'Thu', date: 'Nov 28', high: 29, low: 19, icon: Sun, precipitation: 0, description: 'Hot and sunny' },
];

const weatherAlerts = [
  { type: 'Rain Warning', message: 'Heavy rainfall expected Saturday-Sunday. Consider adjusting irrigation schedules.', severity: 'warning' },
];

const agricultureInsights = [
  { title: 'Irrigation Recommendation', value: 'Reduce 50%', description: 'Rain forecast will provide natural irrigation', icon: Droplets, color: 'blue' },
  { title: 'Frost Risk', value: 'Low', description: 'Minimum temperatures above freezing', icon: Thermometer, color: 'green' },
  { title: 'Evapotranspiration', value: '4.2 mm', description: 'Expected water loss today', icon: Sun, color: 'yellow' },
  { title: 'Spray Conditions', value: 'Good until 4PM', description: 'Wind speeds favorable for spraying', icon: Wind, color: 'emerald' },
];

export default function WeatherPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const Icon = currentWeather.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Weather</h1>
          <p className="text-secondary-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Farm Location - Updated 5 min ago
          </p>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">{weatherAlerts[0].type}</h3>
              <p className="text-sm text-yellow-700 mt-1">{weatherAlerts[0].message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 mb-2">Current Weather</p>
            <div className="flex items-center">
              <span className="text-6xl font-bold">{currentWeather.temperature}°</span>
              <Icon className="h-16 w-16 ml-4 opacity-90" />
            </div>
            <p className="text-xl mt-2">{currentWeather.condition}</p>
            <p className="text-blue-100 text-sm mt-1">Feels like {currentWeather.feelsLike}°C</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-sm mb-2">
              <Sunrise className="h-4 w-4 mr-1" />
              {currentWeather.sunrise}
              <Sunset className="h-4 w-4 ml-3 mr-1" />
              {currentWeather.sunset}
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="flex items-center text-blue-100 text-sm mb-1">
              <Droplets className="h-4 w-4 mr-1" />
              Humidity
            </div>
            <p className="text-xl font-semibold">{currentWeather.humidity}%</p>
          </div>
          <div>
            <div className="flex items-center text-blue-100 text-sm mb-1">
              <Wind className="h-4 w-4 mr-1" />
              Wind
            </div>
            <p className="text-xl font-semibold">{currentWeather.windSpeed} km/h {currentWeather.windDirection}</p>
          </div>
          <div>
            <div className="flex items-center text-blue-100 text-sm mb-1">
              <Eye className="h-4 w-4 mr-1" />
              Visibility
            </div>
            <p className="text-xl font-semibold">{currentWeather.visibility} km</p>
          </div>
          <div>
            <div className="flex items-center text-blue-100 text-sm mb-1">
              <Gauge className="h-4 w-4 mr-1" />
              Pressure
            </div>
            <p className="text-xl font-semibold">{currentWeather.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* Agriculture Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agricultureInsights.map((insight, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-secondary-100">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
              insight.color === 'blue' && 'bg-blue-100',
              insight.color === 'green' && 'bg-green-100',
              insight.color === 'yellow' && 'bg-yellow-100',
              insight.color === 'emerald' && 'bg-emerald-100'
            )}>
              <insight.icon className={cn(
                'h-5 w-5',
                insight.color === 'blue' && 'text-blue-600',
                insight.color === 'green' && 'text-green-600',
                insight.color === 'yellow' && 'text-yellow-600',
                insight.color === 'emerald' && 'text-emerald-600'
              )} />
            </div>
            <p className="text-sm text-secondary-500">{insight.title}</p>
            <p className="text-xl font-bold text-secondary-900 mt-1">{insight.value}</p>
            <p className="text-xs text-secondary-500 mt-1">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Hourly Forecast */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Hourly Forecast</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {hourlyForecast.map((hour, index) => {
            const HourIcon = hour.icon;
            return (
              <div key={index} className="flex-shrink-0 text-center p-3 rounded-lg bg-secondary-50 min-w-[80px]">
                <p className="text-sm text-secondary-500">{hour.time}</p>
                <HourIcon className="h-8 w-8 mx-auto my-2 text-secondary-600" />
                <p className="text-lg font-semibold text-secondary-900">{hour.temp}°</p>
                {hour.precipitation > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    <Droplets className="h-3 w-3 inline" /> {hour.precipitation}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">7-Day Forecast</h2>
        <div className="space-y-3">
          {dailyForecast.map((day, index) => {
            const DayIcon = day.icon;
            return (
              <div
                key={index}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  'flex items-center p-3 rounded-lg cursor-pointer transition-all',
                  selectedDay === index ? 'bg-primary-50 border border-primary-200' : 'hover:bg-secondary-50'
                )}
              >
                <div className="w-20">
                  <p className="font-medium text-secondary-900">{day.day}</p>
                  <p className="text-xs text-secondary-500">{day.date}</p>
                </div>
                <DayIcon className="h-8 w-8 text-secondary-600 mx-4" />
                <div className="flex-1">
                  <p className="text-sm text-secondary-600">{day.description}</p>
                </div>
                {day.precipitation > 0 && (
                  <div className="flex items-center text-blue-600 mx-4">
                    <Droplets className="h-4 w-4 mr-1" />
                    <span className="text-sm">{day.precipitation}%</span>
                  </div>
                )}
                <div className="text-right w-24">
                  <span className="font-semibold text-secondary-900">{day.high}°</span>
                  <span className="text-secondary-400 mx-1">/</span>
                  <span className="text-secondary-500">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Precipitation Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Precipitation Forecast</h2>
        <div className="h-32">
          <div className="flex items-end justify-between h-full gap-2">
            {dailyForecast.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-secondary-100 rounded-t-sm relative" style={{ height: '100px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all"
                    style={{ height: `${day.precipitation}%` }}
                  />
                </div>
                <span className="text-xs text-secondary-500 mt-2">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-600">
            <strong>Total expected rainfall:</strong> 45mm over the next 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
