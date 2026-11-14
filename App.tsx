import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { FavouritesProvider } from './src/context/FavouritesContext';
import { TripProvider } from './src/context/TripContext';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { getDatabase } from './src/database/db';
import { initAndSeedDatabase } from './src/database/seed';

const MainApp: React.FC = () => {
  const { isDark, colors } = useTheme();
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const db = await getDatabase();
        await initAndSeedDatabase(db);
        setDbReady(true);
      } catch (err) {
        setDbError(err instanceof Error ? err.message : 'Database initialisation failed');
      }
    };
    setupDatabase();
  }, []);

  if (dbError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Database Error</Text>
        <Text style={[styles.errorSubtitle, { color: colors.textMuted }]}>{dbError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="leaf" size={54} color={colors.primary} style={{ marginBottom: 16 }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Loading TeaLeaf Tracker...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AuthProvider>
        <FavouritesProvider>
          <TripProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <NavigationContainer documentTitle={{ formatter: () => 'TeaLeaf Tracker' }}>
              <RootNavigator />
            </NavigationContainer>
          </TripProvider>
        </FavouritesProvider>
      </AuthProvider>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <MainApp />
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
  flex: 1,
  ...(Platform.OS === 'web' ? ({ height: '100vh' } as any) : {}),
},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
