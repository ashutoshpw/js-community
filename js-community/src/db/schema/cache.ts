/**
 * Query cache schema
 *
 * A simple key/value store in PostgreSQL used as a caching layer
 * for expensive or frequently-repeated API queries.
 *
 * Rows with an expiresAt in the past are considered stale and
 * are cleaned up hourly by the Inngest cleanup-cache function.
 */

import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const queryCache = pgTable(
  "query_cache",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull(), // JSON-serialized value
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    expiresAtIdx: index("query_cache_expires_at_idx").on(table.expiresAt),
  }),
);

export type QueryCacheEntry = typeof queryCache.$inferSelect;
export type NewQueryCacheEntry = typeof queryCache.$inferInsert;
