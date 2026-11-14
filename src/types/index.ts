export type ElevationClass = 'High-grown' | 'Mid-grown' | 'Low-grown';

export type TeaType = 'Black' | 'Green' | 'White' | 'Silver Tips';

export interface Region {
  id: string;
  name: string;
  elevation_class: ElevationClass;
  description: string;
  image_key: string;
}

export interface Tea {
  id: string;
  name: string;
  region_id: string;
  region_name?: string;
  elevation: ElevationClass;
  type: TeaType;
  flavour_notes: string; // Comma-separated strings, e.g. "Bright, Crisp, Citrus"
  harvest_season: string;
  about: string;
  short_desc: string;
  image_key: string;
  is_featured: number; // 0 or 1
}

export interface Estate {
  id: string;
  name: string;
  region_id: string;
  region_name?: string;
  drive_minutes: number;
  distance_km: number;
  factory_tour: number; // 0 or 1
  best_season: string;
  highlights: string;
  tea_types: string;
  about: string;
  image_key: string;
}

export interface BrewingGuide {
  id: string;
  tea_type: TeaType;
  water_temp_c: number;
  steep_minutes: number;
  leaves_grams_per_cup: number;
  tips: string; // JSON array or newline-separated tips
}

export interface Favourite {
  tea_id: string;
  created_at: string;
}

export interface TripItem {
  estate_id: string;
  created_at: string;
}

export interface FilterCriteria {
  regions: string[];
  elevations: ElevationClass[];
  teaTypes: TeaType[];
  sortBy: 'name_asc' | 'name_desc' | 'elevation';
  searchQuery?: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  salt: string;
  created_at: string;
}

export interface UserSession {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

