import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Estate } from '../types';
import { getDatabase } from '../database/db';
import {
  getTripEstates,
  addTripEstate,
  removeTripEstate,
  clearAllTripEstates,
} from '../database/queries';

interface TripContextType {
  tripEstates: Estate[];
  isInTrip: (estateId: string) => boolean;
  toggleTrip: (estate: Estate) => Promise<void>;
  removeTripItem: (estateId: string) => Promise<void>;
  clearTrip: () => Promise<void>;
  totalDriveMinutes: number;
  totalDistanceKm: number;
  refreshTrip: () => Promise<void>;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripEstates, setTripEstates] = useState<Estate[]>([]);
  const [tripIds, setTripIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refreshTrip = useCallback(async () => {
    try {
      const db = await getDatabase();
      const list = await getTripEstates(db);
      setTripEstates(list);
      setTripIds(new Set(list.map((e) => e.id)));
    } catch {
      // Handled gracefully in UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTrip();
  }, [refreshTrip]);

  const isInTrip = useCallback(
    (estateId: string): boolean => {
      return tripIds.has(estateId);
    },
    [tripIds]
  );

  const toggleTrip = useCallback(
    async (estate: Estate) => {
      const exists = tripIds.has(estate.id);
      const db = await getDatabase();

      if (exists) {
        // Optimistic remove
        setTripIds((prev) => {
          const next = new Set(prev);
          next.delete(estate.id);
          return next;
        });
        setTripEstates((prev) => prev.filter((e) => e.id !== estate.id));
        await removeTripEstate(db, estate.id);
      } else {
        // Optimistic add
        setTripIds((prev) => new Set(prev).add(estate.id));
        setTripEstates((prev) => [estate, ...prev]);
        await addTripEstate(db, estate.id);
      }
    },
    [tripIds]
  );

  const removeTripItem = useCallback(async (estateId: string) => {
    const db = await getDatabase();
    setTripIds((prev) => {
      const next = new Set(prev);
      next.delete(estateId);
      return next;
    });
    setTripEstates((prev) => prev.filter((e) => e.id !== estateId));
    await removeTripEstate(db, estateId);
  }, []);

  const clearTrip = useCallback(async () => {
    const db = await getDatabase();
    setTripIds(new Set());
    setTripEstates([]);
    await clearAllTripEstates(db);
  }, []);

  const totalDriveMinutes = useMemo(() => {
    return tripEstates.reduce((sum, item) => sum + item.drive_minutes, 0);
  }, [tripEstates]);

  const totalDistanceKm = useMemo(() => {
    return tripEstates.reduce((sum, item) => sum + item.distance_km, 0);
  }, [tripEstates]);

  return (
    <TripContext.Provider
      value={{
        tripEstates,
        isInTrip,
        toggleTrip,
        removeTripItem,
        clearTrip,
        totalDriveMinutes,
        totalDistanceKm,
        refreshTrip,
        isLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
