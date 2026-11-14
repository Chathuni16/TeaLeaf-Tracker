import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ElevationClass, TeaType } from '../types';

export interface FilterState {
  regions: string[];
  elevations: ElevationClass[];
  teaTypes: TeaType[];
  sortBy: 'name_asc' | 'name_desc' | 'elevation';
}

export type MainTabParamList = {
  HomeTab: undefined;
  Teas: { regionFilter?: string; autoFocusSearch?: boolean } | undefined;
  BrewingTab: { initialTeaType?: TeaType } | undefined;
  FavouritesTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
<<<<<<< Updated upstream
=======
  Login: undefined;
  SignUp: undefined;
>>>>>>> Stashed changes
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  AllTeas: { regionFilter?: string; autoFocusSearch?: boolean } | undefined;
  FilterTeas: {
    currentFilters?: FilterState;
    onApply?: (filters: FilterState) => void;
  } | undefined;
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
