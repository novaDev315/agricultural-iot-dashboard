'use client';

import { Cloud, Sun, Droplets, Wind, Thermometer } from 'lucide-react';

export function WeatherWidget() {
  const weather = {
    temperature: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 3.2,
    forecast: [
      { day: 'Today', high: 26, low: 18, icon: 'sun' },
      { day: 'Tomorrow', high: 24, low: 16, icon: 'cloud' },
      { day: 'Wed', high: 22, low: 15, icon: 'rain' },
      { day: 'Thu', high: 25, low: 17, icon: 'sun' },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Current Weather</p>
            <p className="text-4xl font-bold mt-1">{weather.temperature}°C</p>
            <p className="text-blue-100 mt-1">{weather.condition}</p>
          </div>
          <Sun className="h-16 w-16 text-yellow-300" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center">
            <Droplets className="h-4 w-4 text-blue-200 mr-2" />
            <span className="text-sm">
              <span className="text-blue-100">Humidity</span>
              <span className="font-medium ml-1">{weather.humidity}%</span>
            </span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 text-blue-200 mr-2" />
            <span className="text-sm">
              <span className="text-blue-100">Wind</span>
              <span className="font-medium ml-1">{weather.windSpeed} m/s</span>
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-400/30">
          <p className="text-xs text-blue-200 mb-3">4-Day Forecast</p>
          <div className="grid grid-cols-4 gap-2">
            {weather.forecast.map((day, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-blue-200">{day.day}</p>
                {day.icon === 'sun' && <Sun className="h-5 w-5 mx-auto my-1 text-yellow-300" />}
                {day.icon === 'cloud' && <Cloud className="h-5 w-5 mx-auto my-1 text-blue-200" />}
                {day.icon === 'rain' && <Droplets className="h-5 w-5 mx-auto my-1 text-blue-200" />}
                <p className="text-xs">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-blue-200 ml-1">{day.low}°</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
