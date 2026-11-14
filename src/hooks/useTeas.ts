import { useState, useEffect, useCallback } from 'react';
import { Tea, FilterCriteria } from '../types';
import { getDatabase } from '../database/db';
import {
  getFilteredTeas,
  getFilteredTeasCount,
  getFeaturedTeas,
  getTeaOfTheDay,
} from '../database/queries';

interface UseTeasOptions {
  criteria?: Partial<FilterCriteria>;
  fetchFeatured?: boolean;
  fetchTeaOfDay?: boolean;
}

export const useTeas = (options: UseTeasOptions = {}) => {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [featuredTeas, setFeaturedTeas] = useState<Tea[]>([]);
  const [teaOfTheDay, setTeaOfTheDay] = useState<Tea | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const criteriaKey = JSON.stringify(options.criteria);

  const fetchTeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await getDatabase();
      const currentCriteria = options.criteria || {};

      const results = await getFilteredTeas(db, currentCriteria);
      setTeas(results);

      const count = await getFilteredTeasCount(db, currentCriteria);
      setTotalCount(count);

      if (options.fetchFeatured) {
        const featured = await getFeaturedTeas(db);
        setFeaturedTeas(featured);
      }

      if (options.fetchTeaOfDay) {
        const todayTea = await getTeaOfTheDay(db);
        setTeaOfTheDay(todayTea);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teas from database');
    } finally {
      setIsLoading(false);
    }
  }, [criteriaKey, options.fetchFeatured, options.fetchTeaOfDay]);

  useEffect(() => {
    fetchTeas();
  }, [fetchTeas]);

  return {
    teas,
    totalCount,
    featuredTeas,
    teaOfTheDay,
    isLoading,
    error,
    refetch: fetchTeas,
  };
};
