import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { getDatabase } from './db';
import { User, UserSession } from '../types';

export type { User, UserSession };

/**
 * Generates a cryptographically random 16-byte salt represented as a 32-character hex string.
 */
export const generateSalt = (): string => {
  try {
    const bytes = Crypto.getRandomBytes(16);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }
};

/**
 * Hashes a plaintext password combined with a salt using SHA-256.
 * Returns a hex-encoded hash string. Plaintext passwords are never persisted.
 */
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
};

/**
 * Finds a registered user by email address (case-insensitive).
 */
export async function findUserByEmail(
  db: SQLiteDatabase,
  email: string
): Promise<User | null>;
export async function findUserByEmail(
  email: string,
  db?: SQLiteDatabase
): Promise<User | null>;
export async function findUserByEmail(
  arg1: SQLiteDatabase | string,
  arg2?: string | SQLiteDatabase
): Promise<User | null> {
  let db: SQLiteDatabase;
  let email: string;

  if (typeof arg1 === 'string') {
    email = arg1;
    db = (arg2 as SQLiteDatabase) || (await getDatabase());
  } else {
    db = arg1;
    email = arg2 as string;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const row = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
    [normalizedEmail]
  );
  return row ?? null;
}

/**
 * Creates a new user record in the local SQLite database with a salted SHA-256 password hash.
 * Stores email strictly in lowercase.
 */
export async function createUser(
  db: SQLiteDatabase,
  fullName: string,
  email: string,
  password: string
): Promise<UserSession>;
export async function createUser(
  fullName: string,
  email: string,
  password: string,
  db?: SQLiteDatabase
): Promise<UserSession>;
export async function createUser(
  arg1: SQLiteDatabase | string,
  arg2: string,
  arg3: string,
  arg4?: string | SQLiteDatabase
): Promise<UserSession> {
  let db: SQLiteDatabase;
  let fullName: string;
  let email: string;
  let password: string;

  if (typeof arg1 === 'string') {
    fullName = arg1;
    email = arg2;
    password = arg3;
    db = (arg4 as SQLiteDatabase) || (await getDatabase());
  } else {
    db = arg1;
    fullName = arg2;
    email = arg3;
    password = arg4 as string;
  }

  const trimmedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    throw new Error('Full name is required.');
  }

  if (!normalizedEmail) {
    throw new Error('Email address is required.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const existing = await findUserByEmail(db, normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  let id: string;
  try {
    id = Crypto.randomUUID();
  } catch {
    id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO users (id, full_name, email, password_hash, salt, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, trimmedName, normalizedEmail, passwordHash, salt, createdAt]
  );

  return {
    id,
    full_name: trimmedName,
    email: normalizedEmail,
    created_at: createdAt,
  };
}

/**
 * Verifies user credentials against the stored salt and SHA-256 hash.
 * Returns the authenticated user session or null if verification fails.
 */
export async function verifyUser(
  db: SQLiteDatabase,
  email: string,
  password: string
): Promise<UserSession | null>;
export async function verifyUser(
  email: string,
  password: string,
  db?: SQLiteDatabase
): Promise<UserSession | null>;
export async function verifyUser(
  arg1: SQLiteDatabase | string,
  arg2: string,
  arg3?: string | SQLiteDatabase,
  arg4?: SQLiteDatabase
): Promise<UserSession | null> {
  let db: SQLiteDatabase;
  let email: string;
  let password: string;

  if (typeof arg1 === 'string') {
    email = arg1;
    password = arg2;
    db = (arg3 as SQLiteDatabase) || (await getDatabase());
  } else {
    db = arg1;
    email = arg2;
    password = arg3 as string;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(db, normalizedEmail);
  if (!user) {
    return null;
  }

  const testHash = await hashPassword(password, user.salt);
  if (testHash !== user.password_hash) {
    return null;
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  };
}
