import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSession } from '../types';
import { createUser, verifyUser, findUserByEmail } from '../database/users';

const SESSION_STORAGE_KEY = '@tealeaf_session';

export interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore saved session from local device storage on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSession) {
          const parsed = JSON.parse(storedSession) as UserSession;
          if (parsed?.email) {
            // Confirm the user still exists in the local SQLite database
            const dbUser = await findUserByEmail(parsed.email);
            if (dbUser) {
              setUser({
                id: dbUser.id,
                full_name: dbUser.full_name,
                email: dbUser.email,
                created_at: dbUser.created_at,
              });
            } else {
              // Stored session user no longer exists in DB
              await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
              setUser(null);
            }
          }
        }
      } catch {
        // Fall back gracefully to logged-out state
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string): Promise<void> => {
    const newUser = await createUser(fullName, email, password);
    setUser(newUser);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logIn = useCallback(async (email: string, password: string): Promise<void> => {
    const verified = await verifyUser(email, password);
    if (!verified) {
      throw new Error('Invalid email or password. Please try again.');
    }
    setUser(verified);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(verified));
  }, []);

  const logOut = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore removal failure
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
