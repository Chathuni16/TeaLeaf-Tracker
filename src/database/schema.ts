export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  elevation_class TEXT NOT NULL,
  description TEXT NOT NULL,
  image_key TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teas (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  region_id TEXT NOT NULL,
  elevation TEXT NOT NULL,
  type TEXT NOT NULL,
  flavour_notes TEXT NOT NULL,
  harvest_season TEXT NOT NULL,
  about TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  image_key TEXT NOT NULL,
  is_featured INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS estates (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  region_id TEXT NOT NULL,
  drive_minutes INTEGER NOT NULL,
  distance_km REAL NOT NULL,
  factory_tour INTEGER NOT NULL DEFAULT 0,
  best_season TEXT NOT NULL,
  highlights TEXT NOT NULL,
  tea_types TEXT NOT NULL,
  about TEXT NOT NULL,
  image_key TEXT NOT NULL,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS brewing_guides (
  id TEXT PRIMARY KEY NOT NULL,
  tea_type TEXT NOT NULL UNIQUE,
  water_temp_c INTEGER NOT NULL,
  steep_minutes REAL NOT NULL,
  leaves_grams_per_cup REAL NOT NULL,
  tips TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favourites (
  tea_id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (tea_id) REFERENCES teas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trip_items (
  estate_id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (estate_id) REFERENCES estates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_metadata (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;
