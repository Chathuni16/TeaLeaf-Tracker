import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ElevationClass, TeaType } from '../types';

export interface FilterState {
  regions: string[];
  elevations: ElevationClass[];
  teaTypes: TeaType[];
  sortBy: 'name_asc' | 'name_desc' | 'elevation';
}

export const DEFAULT_FILTER_STATE: FilterState = {
  regions: [],
  elevations: [],
  teaTypes: [],
  sortBy: 'name_asc',
};

export interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  activeCount: number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  const activeCount = useMemo(() => {
    return filters.regions.length + filters.elevations.length + filters.teaTypes.length;
  }, [filters.regions.length, filters.elevations.length, filters.teaTypes.length]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      activeCount,
    }),
    [filters, resetFilters, activeCount]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useTeaFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useTeaFilters must be used within a FilterProvider');
  }
  return context;
};
