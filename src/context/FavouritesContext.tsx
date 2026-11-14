import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Tea } from '../types';
import { getDatabase } from '../database/db';
import {
  getFavouriteTeas,
  isTeaFavourite as checkIsFav,
  addFavouriteTea,
  removeFavouriteTea,
} from '../database/queries';

interface FavouritesContextType {
  favourites: Tea[];
  isFavourite: (teaId: string) => boolean;
  toggleFavourite: (tea: Tea) => Promise<void>;
  removeFavourite: (teaId: string) => Promise<void>;
  refreshFavourites: () => Promise<void>;
  isLoading: boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<Tea[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavourites = useCallback(async () => {
    try {
      const db = await getDatabase();
      const favList = await getFavouriteTeas(db);
      setFavourites(favList);
      setFavouriteIds(new Set(favList.map((t) => t.id)));
    } catch {
      // Handled gracefully in UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavourites();
  }, [refreshFavourites]);

  const isFavourite = useCallback(
    (teaId: string): boolean => {
      return favouriteIds.has(teaId);
    },
    [favouriteIds]
  );

  const toggleFavourite = useCallback(
    async (tea: Tea) => {
      const exists = favouriteIds.has(tea.id);
      const db = await getDatabase();

      if (exists) {
        // Optimistic update
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(tea.id);
          return next;
        });
        setFavourites((prev) => prev.filter((t) => t.id !== tea.id));
        await removeFavouriteTea(db, tea.id);
      } else {
        // Optimistic update
        setFavouriteIds((prev) => new Set(prev).add(tea.id));
        setFavourites((prev) => [tea, ...prev]);
        await addFavouriteTea(db, tea.id);
      }
    },
    [favouriteIds]
  );

  const removeFavourite = useCallback(async (teaId: string) => {
    const db = await getDatabase();
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      next.delete(teaId);
      return next;
    });
    setFavourites((prev) => prev.filter((t) => t.id !== teaId));
    await removeFavouriteTea(db, teaId);
  }, []);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        refreshFavourites,
        isLoading,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = (): FavouritesContextType => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
