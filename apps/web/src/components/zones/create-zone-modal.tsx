'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateZoneModalProps {
  onClose: () => void;
}

const cropTypes = ['Corn', 'Wheat', 'Soybeans', 'Cotton', 'Rice', 'Tomatoes', 'Lettuce', 'Other'];
const soilTypes = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Peaty', 'Chalky'];
const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export function CreateZoneModal({ onClose }: CreateZoneModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    areaAcres: '',
    cropType: '',
    soilType: '',
    color: colors[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create zone
    console.log('Creating zone:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">Create New Zone</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Zone Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., North Field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Area (acres)
            </label>
            <input
              type="number"
              value={formData.areaAcres}
              onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., 25"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Crop Type
            </label>
            <select
              value={formData.cropType}
              onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select crop type</option>
              {cropTypes.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Soil Type
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select soil type</option>
              {soilTypes.map((soil) => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Zone Color
            </label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Create Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
