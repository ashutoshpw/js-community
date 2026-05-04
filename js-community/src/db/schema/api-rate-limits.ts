/**
 * API rate limit schema
 *
 * Tracks request counts per identifier (IP address or user ID) over a
 * sliding window. Used by the Next.js middleware to reject clients that
 * exceed the per-minute request ceiling.
 *
 * Note: For high-traffic deployments, replace this with an in-memory store
 * (e.g. Vercel KV / Redis). This Postgres table works well for moderate traffic.
 */

import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const apiRateLimits = pgTable(
  "api_rate_limits",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    /** IP address or user ID used as the rate-limit key */
    identifier: text("identifier").notNull(),
    /** API route prefix being limited, e.g. "/api/forum" */
    route: text("route").notNull().default("/api"),
    /** Number of requests in the current window */
    requests: integer("requests").notNull().default(1),
    /** Start of the current rate-limit window */
    windowStart: timestamp("window_start", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    identifierRouteIdx: index("api_rate_limits_identifier_route_idx").on(
      table.identifier,
      table.route,
    ),
    windowStartIdx: index("api_rate_limits_window_start_idx").on(
      table.windowStart,
    ),
  }),
);

export type ApiRateLimit = typeof apiRateLimits.$inferSelect;
export type NewApiRateLimit = typeof apiRateLimits.$inferInsert;
