import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ElevationClass, TeaType } from '../types';
export type { FilterState } from '../context/FilterContext';

export type MainTabParamList = {
  HomeTab: undefined;
  Teas: { regionFilter?: string; autoFocusSearch?: boolean } | undefined;
  BrewingTab: { initialTeaType?: TeaType } | undefined;
  FavouritesTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  AllTeas: { regionFilter?: string; autoFocusSearch?: boolean } | undefined;
  FilterTeas: undefined;
  TeaDetails: { teaId: string };
  RegionExplorer: undefined;
  EstatesToVisit: { regionFilter?: string } | undefined;
  EstateDetails: { estateId: string };
  MyTrip: undefined;
  Settings: undefined;
  Info: { title: string; contentKey: 'privacy' | 'about' | 'contact' };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
