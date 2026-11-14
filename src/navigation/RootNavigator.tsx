import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { WelcomeScreen } from '../screens/WelcomeScreen';
<<<<<<< Updated upstream
=======
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
>>>>>>> Stashed changes
import { AllTeasScreen } from '../screens/AllTeasScreen';
import { FilterScreen } from '../screens/FilterScreen';
import { TeaDetailsScreen } from '../screens/TeaDetailsScreen';
import { RegionExplorerScreen } from '../screens/RegionExplorerScreen';
import { EstatesToVisitScreen } from '../screens/EstatesToVisitScreen';
import { EstateDetailsScreen } from '../screens/EstateDetailsScreen';
import { MyTripScreen } from '../screens/MyTripScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
<<<<<<< Updated upstream
=======
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
>>>>>>> Stashed changes
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AllTeas" component={AllTeasScreen} />
      <Stack.Screen
        name="FilterTeas"
        component={FilterScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="TeaDetails" component={TeaDetailsScreen} />
      <Stack.Screen name="RegionExplorer" component={RegionExplorerScreen} />
      <Stack.Screen name="EstatesToVisit" component={EstatesToVisitScreen} />
      <Stack.Screen name="EstateDetails" component={EstateDetailsScreen} />
      <Stack.Screen name="MyTrip" component={MyTripScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
};
