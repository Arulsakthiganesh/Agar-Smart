import { create } from 'zustand';
import { User, Parcel, Building, Floor, Unit, LayerVisibility, CameraPreset } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  selectedParcel: Parcel | null;
  selectedBuilding: Building | null;
  selectedFloor: number | null; // Floor number (e.g. 7)
  selectedUnit: Unit | null;
  explodedView: boolean;
  explodedDistance: number;
  undergroundMode: boolean;
  activeTab: string;
  cameraPreset: CameraPreset;
  layers: LayerVisibility;

  // Actions
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
  setSelectedParcel: (parcel: Parcel | null) => void;
  setSelectedBuilding: (building: Building | null) => void;
  setSelectedFloor: (floorNum: number | null) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  toggleExplodedView: () => void;
  setExplodedDistance: (dist: number) => void;
  toggleUndergroundMode: () => void;
  setUndergroundMode: (val: boolean) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleLayer: (layerKey: keyof LayerVisibility) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: 1,
    name: "Admin Officer",
    email: "admin@bhumi3d.gov.in",
    role: "administrator"
  },
  token: localStorage.getItem('bhumi_token') || 'demo_jwt_token',
  selectedParcel: null,
  selectedBuilding: null,
  selectedFloor: null,
  selectedUnit: null,
  explodedView: false,
  explodedDistance: 2.2,
  undergroundMode: false,
  activeTab: 'dashboard',
  cameraPreset: 'isometric',
  layers: {
    landParcels: true,
    buildings: true,
    floors: true,
    roads: true,
    underground: false,
    propertyBoundaries: true,
    airRights: false,
    dem: true,
  },

  setUser: (user, token) => {
    if (token) localStorage.setItem('bhumi_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('bhumi_token');
    set({ user: null, token: null });
  },
  setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  setSelectedFloor: (floorNum) => set({ selectedFloor: floorNum }),
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
  toggleExplodedView: () => set((state) => ({ explodedView: !state.explodedView })),
  setExplodedDistance: (dist) => set({ explodedDistance: dist }),
  toggleUndergroundMode: () => set((state) => ({
    undergroundMode: !state.undergroundMode,
    layers: { ...state.layers, underground: !state.undergroundMode }
  })),
  setUndergroundMode: (val) => set((state) => ({
    undergroundMode: val,
    layers: { ...state.layers, underground: val }
  })),
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  toggleLayer: (key) => set((state) => ({
    layers: { ...state.layers, [key]: !state.layers[key] }
  })),
}));
