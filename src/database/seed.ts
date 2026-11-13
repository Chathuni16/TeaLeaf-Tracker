import { SQLiteDatabase } from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';
import regionsData from '../data/regions.json';
import teasData from '../data/teas.json';
import estatesData from '../data/estates.json';
import brewingData from '../data/brewing.json';

const CURRENT_DATA_VERSION = '4';

/**
 * Initializes the SQLite database schema and seeds initial data from bundled JSON files.
 * Uses a versioned metadata check so seeding only executes once on first launch.
 */
export const initAndSeedDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    // 1. Create all required tables
    await db.execAsync(CREATE_TABLES_SQL);

    // 2. Check if already seeded at the current data version
    const versionRow = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      ['data_version']
    );

    const seededRow = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      ['seeded']
    );

    if (versionRow?.value === CURRENT_DATA_VERSION && seededRow?.value === 'true') {
      // Database already up-to-date and seeded
      return;
    }

    // 3. Seed Regions using parameterized queries
    for (const r of regionsData) {
      await db.runAsync(
        `INSERT OR REPLACE INTO regions (id, name, elevation_class, description, image_key)
         VALUES (?, ?, ?, ?, ?)`,
        [r.id, r.name, r.elevation_class, r.description, r.image_key]
      );
    }

    // 4. Seed Teas
    for (const t of teasData) {
      await db.runAsync(
        `INSERT OR REPLACE INTO teas (id, name, region_id, elevation, type, flavour_notes, harvest_season, about, short_desc, image_key, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.name,
          t.region_id,
          t.elevation,
          t.type,
          t.flavour_notes,
          t.harvest_season,
          t.about,
          t.short_desc,
          t.image_key,
          t.is_featured,
        ]
      );
    }

    // 5. Seed Estates
    for (const e of estatesData) {
      await db.runAsync(
        `INSERT OR REPLACE INTO estates (id, name, region_id, drive_minutes, distance_km, factory_tour, best_season, highlights, tea_types, about, image_key)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.id,
          e.name,
          e.region_id,
          e.drive_minutes,
          e.distance_km,
          e.factory_tour,
          e.best_season,
          e.highlights,
          e.tea_types,
          e.about,
          e.image_key,
        ]
      );
    }

    // 6. Seed Brewing Guides
    for (const b of brewingData) {
      await db.runAsync(
        `INSERT OR REPLACE INTO brewing_guides (id, tea_type, water_temp_c, steep_minutes, leaves_grams_per_cup, tips)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [b.id, b.tea_type, b.water_temp_c, b.steep_minutes, b.leaves_grams_per_cup, b.tips]
      );
    }

    // 7. Write completion metadata
    await db.runAsync(`INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)`, [
      'data_version',
      CURRENT_DATA_VERSION,
    ]);
    await db.runAsync(`INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)`, [
      'seeded',
      'true',
    ]);
  } catch (error) {
    // Let caller handle or display user-friendly error
    throw new Error(`Database seeding failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
