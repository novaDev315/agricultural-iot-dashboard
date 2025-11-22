'use client';

import { useState, useEffect } from 'react';

interface SensorChartProps {
  sensorType: string;
}

export function SensorChart({ sensorType }: SensorChartProps) {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    // Generate 24 hours of mock data
    const generateData = () => {
      const baseValues: Record<string, number> = {
        soil_moisture: 45,
        air_temperature: 24,
        air_humidity: 60,
        soil_temperature: 18,
        light_intensity: 40000,
        wind_speed: 4,
        soil_ph: 6.5,
        water_pressure: 2.2,
      };

      const base = baseValues[sensorType] || 50;
      const newData: number[] = [];

      for (let i = 0; i < 24; i++) {
        const variation = Math.sin(i / 4) * (base * 0.1) + (Math.random() - 0.5) * (base * 0.05);
        newData.push(base + variation);
      }

      setData(newData);
    };

    generateData();
  }, [sensorType]);

  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-24 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" strokeWidth="0.5" />

        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-xs text-secondary-400 mt-1">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
