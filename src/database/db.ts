import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'ceylonteaguide.db';

let dbInstance: SQLiteDatabase | null = null;

/**
 * Returns the shared SQLite database connection.
 * Initialises the database file on first call.
 */
export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await openDatabaseAsync(DB_NAME);
  // Ensure foreign key constraints are enforced
  await dbInstance.execAsync('PRAGMA foreign_keys = ON;');
  return dbInstance;
};
