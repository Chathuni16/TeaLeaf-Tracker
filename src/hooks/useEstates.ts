import { useState, useEffect, useCallback } from 'react';
import { Estate } from '../types';
import { getDatabase } from '../database/db';
import { getAllEstates } from '../database/queries';

interface UseEstatesOptions {
  searchQuery?: string;
  regionFilter?: string;
}

export const useEstates = (options: UseEstatesOptions = {}) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await getDatabase();
      const results = await getAllEstates(db, options.searchQuery, options.regionFilter);
      setEstates(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load estates from database');
    } finally {
      setIsLoading(false);
    }
  }, [options.searchQuery, options.regionFilter]);

  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);

  return {
    estates,
    isLoading,
    error,
    refetch: fetchEstates,
  };
};
