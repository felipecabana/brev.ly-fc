import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const linkExports = pgTable('exports', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: text('file_name').notNull(),
  publicUrl: text('public_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
export type LinkExport = typeof linkExports.$inferSelect
export type NewLinkExport = typeof linkExports.$inferInsert
