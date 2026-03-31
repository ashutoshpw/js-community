import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const passwordResetRateLimits = pgTable(
  "password_reset_rate_limits",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    identifier: text("identifier").notNull().unique(),
    attempts: integer("attempts").notNull().default(0),
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    identifierIdx: index("password_reset_rate_limits_identifier_idx").on(
      table.identifier,
    ),
    blockedUntilIdx: index("password_reset_rate_limits_blocked_until_idx").on(
      table.blockedUntil,
    ),
  }),
);

export type PasswordResetRateLimit =
  typeof passwordResetRateLimits.$inferSelect;
export type NewPasswordResetRateLimit =
  typeof passwordResetRateLimits.$inferInsert;
