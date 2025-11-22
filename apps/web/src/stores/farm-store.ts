import { create } from 'zustand';
import { api } from '@/lib/api';

interface Farm {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  areaAcres: number;
  timezone: string;
}

interface Zone {
  id: string;
  farmId: string;
  name: string;
  areaAcres: number;
  cropType?: string;
  soilType?: string;
  color?: string;
}

interface FarmState {
  farms: Farm[];
  currentFarm: Farm | null;
  zones: Zone[];
  isLoading: boolean;
  error: string | null;
  fetchFarms: () => Promise<void>;
  selectFarm: (farm: Farm) => void;
  fetchZones: (farmId: string) => Promise<void>;
  createFarm: (data: Partial<Farm>) => Promise<Farm>;
  createZone: (data: Partial<Zone>) => Promise<Zone>;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  currentFarm: null,
  zones: [],
  isLoading: false,
  error: null,

  fetchFarms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/farms');
      const farms = response.data;
      set({
        farms,
        currentFarm: farms[0] || null,
        isLoading: false,
      });

      if (farms[0]) {
        get().fetchZones(farms[0].id);
      }
    } catch (error) {
      set({ error: 'Failed to fetch farms', isLoading: false });
    }
  },

  selectFarm: (farm: Farm) => {
    set({ currentFarm: farm });
    get().fetchZones(farm.id);
  },

  fetchZones: async (farmId: string) => {
    try {
      const response = await api.get(`/zones?farmId=${farmId}`);
      set({ zones: response.data });
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    }
  },

  createFarm: async (data: Partial<Farm>) => {
    const response = await api.post('/farms', data);
    const newFarm = response.data;
    set((state) => ({
      farms: [...state.farms, newFarm],
      currentFarm: newFarm,
    }));
    return newFarm;
  },

  createZone: async (data: Partial<Zone>) => {
    const response = await api.post('/zones', data);
    const newZone = response.data;
    set((state) => ({
      zones: [...state.zones, newZone],
    }));
    return newZone;
  },
}));
