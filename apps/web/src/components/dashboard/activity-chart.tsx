'use client';

import { useState } from 'react';

export function ActivityChart() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');

  // Mock data for the chart
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    temperature: 18 + Math.sin(i / 4) * 6 + Math.random() * 2,
    humidity: 50 + Math.cos(i / 6) * 15 + Math.random() * 5,
    moisture: 35 + Math.sin(i / 8) * 10 + Math.random() * 3,
  }));

  const maxTemp = Math.max(...data.map(d => d.temperature));
  const maxHumidity = Math.max(...data.map(d => d.humidity));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
      <div className="p-5 border-b border-secondary-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Sensor Activity</h2>
          <p className="text-sm text-secondary-500">Temperature and humidity trends</p>
        </div>
        <div className="flex space-x-1 bg-secondary-100 rounded-lg p-1">
          {(['24h', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        {/* Simple SVG chart */}
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 50}
                x2="400"
                y2={i * 50}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}

            {/* Temperature line */}
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              points={data.map((d, i) => `${(i / 23) * 400},${200 - (d.temperature / 40) * 200}`).join(' ')}
            />

            {/* Humidity line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.map((d, i) => `${(i / 23) * 400},${200 - (d.humidity / 100) * 200}`).join(' ')}
            />

            {/* Moisture line */}
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              points={data.map((d, i) => `${(i / 23) * 400},${200 - (d.moisture / 100) * 200}`).join(' ')}
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-secondary-400 -ml-8">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-sm text-secondary-600">Temperature</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm text-secondary-600">Humidity</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-secondary-600">Soil Moisture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
