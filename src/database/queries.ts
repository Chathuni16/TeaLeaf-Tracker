import { SQLiteDatabase } from 'expo-sqlite';
import { Tea, Region, Estate, BrewingGuide, FilterCriteria, ElevationClass, TeaType } from '../types';

/**
 * -------------------------------------------------------------
 * TEA QUERIES
 * -------------------------------------------------------------
 */

export const getAllTeas = async (db: SQLiteDatabase): Promise<Tea[]> => {
  return await db.getAllAsync<Tea>(
    `SELECT t.*, r.name as region_name
     FROM teas t
     LEFT JOIN regions r ON t.region_id = r.id
     ORDER BY t.name ASC`
  );
};

export const getFeaturedTeas = async (db: SQLiteDatabase): Promise<Tea[]> => {
  return await db.getAllAsync<Tea>(
    `SELECT t.*, r.name as region_name
     FROM teas t
     LEFT JOIN regions r ON t.region_id = r.id
     WHERE t.is_featured = 1
     ORDER BY t.name ASC`
  );
};

export const getTeaById = async (db: SQLiteDatabase, id: string): Promise<Tea | null> => {
  const result = await db.getFirstAsync<Tea>(
    `SELECT t.*, r.name as region_name
     FROM teas t
     LEFT JOIN regions r ON t.region_id = r.id
     WHERE t.id = ?`,
    [id]
  );
  return result ?? null;
};

/**
 * Builds dynamic WHERE clause and parameter list safely to avoid SQL injection.
 */
const buildTeaFilterQuery = (
  criteria: Partial<FilterCriteria>
): { whereSql: string; params: (string | number)[]; orderSql: string } => {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  // Search query: matches tea name, region name, type, or flavour notes
  if (criteria.searchQuery && criteria.searchQuery.trim().length > 0) {
    const term = `%${criteria.searchQuery.trim().toLowerCase()}%`;
    clauses.push(
      `(LOWER(t.name) LIKE ? OR LOWER(r.name) LIKE ? OR LOWER(t.type) LIKE ? OR LOWER(t.flavour_notes) LIKE ?)`
    );
    params.push(term, term, term, term);
  }

  // Region filter: multi-select (e.g. ['Nuwara Eliya', 'Dimbula'] or ids)
  if (criteria.regions && criteria.regions.length > 0) {
    const placeholders = criteria.regions.map(() => '?').join(', ');
    clauses.push(`(r.name IN (${placeholders}) OR t.region_id IN (${placeholders}))`);
    params.push(...criteria.regions, ...criteria.regions);
  }

  // Elevation filter
  if (criteria.elevations && criteria.elevations.length > 0) {
    const placeholders = criteria.elevations.map(() => '?').join(', ');
    clauses.push(`t.elevation IN (${placeholders})`);
    params.push(...criteria.elevations);
  }

  // Tea type filter
  if (criteria.teaTypes && criteria.teaTypes.length > 0) {
    const placeholders = criteria.teaTypes.map(() => '?').join(', ');
    clauses.push(`t.type IN (${placeholders})`);
    params.push(...criteria.teaTypes);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

  let orderSql = 'ORDER BY t.name ASC';
  if (criteria.sortBy === 'name_desc') {
    orderSql = 'ORDER BY t.name DESC';
  } else if (criteria.sortBy === 'elevation') {
    // Custom elevation ordering: High-grown first, then Mid-grown, then Low-grown
    orderSql = `ORDER BY CASE t.elevation
      WHEN 'High-grown' THEN 1
      WHEN 'Mid-grown' THEN 2
      WHEN 'Low-grown' THEN 3
      ELSE 4 END, t.name ASC`;
  }

  return { whereSql, params, orderSql };
};

export const getFilteredTeas = async (
  db: SQLiteDatabase,
  criteria: Partial<FilterCriteria>
): Promise<Tea[]> => {
  const { whereSql, params, orderSql } = buildTeaFilterQuery(criteria);
  const sql = `
    SELECT t.*, r.name as region_name
    FROM teas t
    LEFT JOIN regions r ON t.region_id = r.id
    ${whereSql}
    ${orderSql}
  `;
  return await db.getAllAsync<Tea>(sql, params);
};

export const getFilteredTeasCount = async (
  db: SQLiteDatabase,
  criteria: Partial<FilterCriteria>
): Promise<number> => {
  const { whereSql, params } = buildTeaFilterQuery(criteria);
  const sql = `
    SELECT COUNT(*) as count
    FROM teas t
    LEFT JOIN regions r ON t.region_id = r.id
    ${whereSql}
  `;
  const result = await db.getFirstAsync<{ count: number }>(sql, params);
  return result?.count ?? 0;
};

/**
 * Deterministic Tea of the Day based on day of year modulo count.
 */
export const getTeaOfTheDay = async (db: SQLiteDatabase): Promise<Tea | null> => {
  const teas = await getAllTeas(db);
  if (teas.length === 0) return null;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = dayOfYear % teas.length;
  return teas[index];
};

/**
 * -------------------------------------------------------------
 * REGION QUERIES
 * -------------------------------------------------------------
 */

export const getAllRegions = async (db: SQLiteDatabase): Promise<Region[]> => {
  return await db.getAllAsync<Region>('SELECT * FROM regions ORDER BY name ASC');
};

export const getRegionById = async (db: SQLiteDatabase, id: string): Promise<Region | null> => {
  const result = await db.getFirstAsync<Region>('SELECT * FROM regions WHERE id = ?', [id]);
  return result ?? null;
};

/**
 * -------------------------------------------------------------
 * ESTATE QUERIES
 * -------------------------------------------------------------
 */

export const getAllEstates = async (
  db: SQLiteDatabase,
  searchQuery?: string,
  regionFilter?: string
): Promise<Estate[]> => {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (searchQuery && searchQuery.trim().length > 0) {
    const term = `%${searchQuery.trim().toLowerCase()}%`;
    clauses.push('(LOWER(e.name) LIKE ? OR LOWER(r.name) LIKE ? OR LOWER(e.highlights) LIKE ?)');
    params.push(term, term, term);
  }

  if (regionFilter && regionFilter.trim().length > 0) {
    clauses.push('(r.name = ? OR e.region_id = ?)');
    params.push(regionFilter, regionFilter);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `
    SELECT e.*, r.name as region_name
    FROM estates e
    LEFT JOIN regions r ON e.region_id = r.id
    ${whereSql}
    ORDER BY e.distance_km ASC
  `;

  return await db.getAllAsync<Estate>(sql, params);
};

export const getEstateById = async (db: SQLiteDatabase, id: string): Promise<Estate | null> => {
  const result = await db.getFirstAsync<Estate>(
    `SELECT e.*, r.name as region_name
     FROM estates e
     LEFT JOIN regions r ON e.region_id = r.id
     WHERE e.id = ?`,
    [id]
  );
  return result ?? null;
};

/**
 * -------------------------------------------------------------
 * BREWING GUIDE QUERIES
 * -------------------------------------------------------------
 */

export const getAllBrewingGuides = async (db: SQLiteDatabase): Promise<BrewingGuide[]> => {
  return await db.getAllAsync<BrewingGuide>('SELECT * FROM brewing_guides');
};

export const getBrewingGuideByType = async (
  db: SQLiteDatabase,
  teaType: TeaType
): Promise<BrewingGuide | null> => {
  const result = await db.getFirstAsync<BrewingGuide>(
    'SELECT * FROM brewing_guides WHERE tea_type = ?',
    [teaType]
  );
  return result ?? null;
};

/**
 * -------------------------------------------------------------
 * FAVOURITES QUERIES
 * -------------------------------------------------------------
 */

export const getFavouriteTeas = async (db: SQLiteDatabase): Promise<Tea[]> => {
  return await db.getAllAsync<Tea>(
    `SELECT t.*, r.name as region_name
     FROM favourites f
     JOIN teas t ON f.tea_id = t.id
     LEFT JOIN regions r ON t.region_id = r.id
     ORDER BY f.created_at DESC`
  );
};

export const isTeaFavourite = async (db: SQLiteDatabase, teaId: string): Promise<boolean> => {
  const row = await db.getFirstAsync<{ tea_id: string }>(
    'SELECT tea_id FROM favourites WHERE tea_id = ?',
    [teaId]
  );
  return !!row;
};

export const addFavouriteTea = async (db: SQLiteDatabase, teaId: string): Promise<void> => {
  await db.runAsync(
    'INSERT OR IGNORE INTO favourites (tea_id, created_at) VALUES (?, ?)',
    [teaId, new Date().toISOString()]
  );
};

export const removeFavouriteTea = async (db: SQLiteDatabase, teaId: string): Promise<void> => {
  await db.runAsync('DELETE FROM favourites WHERE tea_id = ?', [teaId]);
};

/**
 * -------------------------------------------------------------
 * TRIP ITEMS QUERIES
 * -------------------------------------------------------------
 */

export const getTripEstates = async (db: SQLiteDatabase): Promise<Estate[]> => {
  return await db.getAllAsync<Estate>(
    `SELECT e.*, r.name as region_name
     FROM trip_items ti
     JOIN estates e ON ti.estate_id = e.id
     LEFT JOIN regions r ON e.region_id = r.id
     ORDER BY ti.created_at DESC`
  );
};

export const isEstateInTrip = async (db: SQLiteDatabase, estateId: string): Promise<boolean> => {
  const row = await db.getFirstAsync<{ estate_id: string }>(
    'SELECT estate_id FROM trip_items WHERE estate_id = ?',
    [estateId]
  );
  return !!row;
};

export const addTripEstate = async (db: SQLiteDatabase, estateId: string): Promise<void> => {
  await db.runAsync(
    'INSERT OR IGNORE INTO trip_items (estate_id, created_at) VALUES (?, ?)',
    [estateId, new Date().toISOString()]
  );
};

export const removeTripEstate = async (db: SQLiteDatabase, estateId: string): Promise<void> => {
  await db.runAsync('DELETE FROM trip_items WHERE estate_id = ?', [estateId]);
};

export const clearAllTripEstates = async (db: SQLiteDatabase): Promise<void> => {
  await db.runAsync('DELETE FROM trip_items');
};
