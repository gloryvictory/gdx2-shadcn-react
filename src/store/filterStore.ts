import { create } from 'zustand';

interface FeatureData {
  id: string | number;
  properties: Record<string, any>;
  geometry?: any;
  source: string;
}

interface FilteredFeaturesState {
  filteredFeatures: FeatureData[];
  setFilteredFeatures: (features: FeatureData[]) => void;
  stp: FeatureData[];
  setStp: (features: FeatureData[]) => void;
  stl: FeatureData[];
  setStl: (features: FeatureData[]) => void;
  sta: FeatureData[];
  setSta: (features: FeatureData[]) => void;
}

export const useFilteredFeaturesStore = create<FilteredFeaturesState>((set) => ({
  filteredFeatures: [],
  setFilteredFeatures: (features) => set({ filteredFeatures: features }),
  stp: [],
  setStp: (features) => set({ stp: features }),
  stl: [],
  setStl: (features) => set({ stl: features }),
  sta: [],
  setSta: (features) => set({ sta: features }),
}));
