import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

let db: PostgresJsDatabase<typeof schema>;

export function database() {
  const {
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME
  } = process.env;

  if (!DATABASE_USERNAME)
    throw new Error('Environment variable DATABASE_USERNAME is required.');
  if (!DATABASE_PASSWORD)
    throw new Error('Environment variable DATABASE_PASSWORD is required.');
  if (!DATABASE_HOST)
    throw new Error('Environment variable DATABASE_HOST is required.');
  if (!DATABASE_PORT)
    throw new Error('Environment variable DATABASE_PORT is required.');
  if (!DATABASE_NAME)
    throw new Error('Environment variable DATABASE_NAME is required.');

  const connectionString = `postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

  if (!db) {
    const client = postgres(connectionString);
    db = drizzle(client, { schema });
  }

  return db;
}
