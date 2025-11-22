'use client';

import { useEffect, useRef } from 'react';

interface Zone {
  id: string;
  name: string;
  areaAcres: number;
  cropType: string;
  color: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface ZoneMapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
}

export function ZoneMap({ zones, selectedZone, onSelectZone }: ZoneMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw farm boundary
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(20, 20, rect.width - 40, rect.height - 40);
    ctx.setLineDash([]);

    // Draw zones as rectangles in a grid
    const zoneWidth = (rect.width - 60) / 3;
    const zoneHeight = (rect.height - 60) / 2;
    const padding = 10;

    zones.forEach((zone, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 30 + col * zoneWidth;
      const y = 30 + row * zoneHeight;
      const w = zoneWidth - padding;
      const h = zoneHeight - padding;

      // Zone background
      ctx.fillStyle = zone.color + '40';
      ctx.fillRect(x, y, w, h);

      // Zone border
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = selectedZone?.id === zone.id ? 3 : 1;
      ctx.strokeRect(x, y, w, h);

      // Zone name
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(zone.name, x + 10, y + 25);

      // Zone info
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${zone.areaAcres} acres • ${zone.cropType}`, x + 10, y + 45);

      // Status indicator
      const statusColors = { healthy: '#22c55e', warning: '#f59e0b', critical: '#ef4444' };
      ctx.beginPath();
      ctx.arc(x + w - 15, y + 15, 6, 0, Math.PI * 2);
      ctx.fillStyle = statusColors[zone.status];
      ctx.fill();
    });

    // Handle click events
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      zones.forEach((zone, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const zx = 30 + col * zoneWidth;
        const zy = 30 + row * zoneHeight;
        const w = zoneWidth - padding;
        const h = zoneHeight - padding;

        if (x >= zx && x <= zx + w && y >= zy && y <= zy + h) {
          onSelectZone(zone);
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [zones, selectedZone, onSelectZone]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-secondary-900">Farm Map</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Healthy
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            Warning
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            Critical
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-96 rounded-lg cursor-pointer"
        style={{ backgroundColor: '#f1f5f9' }}
      />
      {selectedZone && (
        <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-secondary-900">{selectedZone.name}</h3>
              <p className="text-sm text-secondary-500">
                {selectedZone.areaAcres} acres • {selectedZone.cropType}
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
