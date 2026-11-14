import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const NOTIFICATIONS_STORAGE_KEY = '@ceylon_tea_guide_notifications';
const SHOW_TIPS_STORAGE_KEY = '@ceylon_tea_guide_show_tips';

interface SettingsContextType {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  showTips: boolean;
  setShowTips: (show: boolean) => Promise<void>;
  isOfflineReady: boolean;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [showTips, setShowTipsState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedNotif = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (storedNotif !== null) {
          setNotificationsEnabledState(storedNotif === 'true');
        }

        const storedTips = await AsyncStorage.getItem(SHOW_TIPS_STORAGE_KEY);
        if (storedTips !== null) {
          setShowTipsState(storedTips === 'true');
        }
      } catch {
        // Fallback to defaults
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setNotificationsEnabled = async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    try {
      if (enabled) {
        // Request notification permission locally
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          setNotificationsEnabledState(false);
          await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, 'false');
          return;
        }
      }
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {
      // Handled silently
    }
  };

  const setShowTips = async (show: boolean) => {
    setShowTipsState(show);
    try {
      await AsyncStorage.setItem(SHOW_TIPS_STORAGE_KEY, show ? 'true' : 'false');
    } catch {
      // Handled silently
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        notificationsEnabled,
        setNotificationsEnabled,
        showTips,
        setShowTips,
        isOfflineReady: true,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
