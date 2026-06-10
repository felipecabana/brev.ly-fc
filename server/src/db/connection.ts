import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../config/env.js'
import * as schema from './schema.js'

const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(queryClient, { schema })

export type Database = typeof db

export async function verifyDatabaseConnection(): Promise<void> {
  await db.execute(sql`SELECT 1`)
}

export async function closeDatabase(): Promise<void> {
  await queryClient.end({ timeout: 5 })
}
