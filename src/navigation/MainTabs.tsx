import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { AllTeasScreen } from '../screens/AllTeasScreen';
import { BrewingGuideScreen } from '../screens/BrewingGuideScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { MainTabParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { useResponsive } from '../utils/responsive';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isDesktop, isTablet } = useResponsive();

  const iconSize = isDesktop ? 26 : isTablet ? 25 : 24;
  const bottomPadding = Math.max(insets.bottom, 8);
  const tabHeight = isDesktop ? 80 : isTablet ? 76 : 62 + bottomPadding;
  const tabMaxWidth = isDesktop ? 860 : isTablet ? 700 : undefined;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          ...(tabMaxWidth
            ? {
                maxWidth: tabMaxWidth,
                width: '100%',
                alignSelf: 'center',
                borderRadius: borderRadius.lg,
                marginBottom: isDesktop ? 12 : 8,
                elevation: 4,
              }
            : {}),
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: typography.weights.semiBold,
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Teas"
        component={AllTeasScreen}
        options={{
          tabBarLabel: 'Teas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrewingTab"
        component={BrewingGuideScreen}
        options={{
          tabBarLabel: 'Brewing',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cafe' : 'cafe-outline'} size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={iconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
