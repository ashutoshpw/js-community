/**
 * Site Settings Schema
 *
 * Stores site-wide settings for admin configuration.
 */

import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  dataType: text("data_type").notNull().default("string"), // string, integer, boolean, list
  value: text("value"),
  description: text("description"),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adminActions = pgTable("admin_actions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // user_ban, user_promote, setting_change, etc.
  targetType: text("target_type"), // user, topic, post, setting
  targetId: integer("target_id"),
  details: text("details"), // JSON string with action details
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userBans = pgTable("user_bans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bannedById: integer("banned_by_id").notNull(),
  reason: text("reason"),
  bannedUntil: timestamp("banned_until", { withTimezone: true }),
  isPermanent: boolean("is_permanent").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  unbannedAt: timestamp("unbanned_at", { withTimezone: true }),
  unbannedById: integer("unbanned_by_id"),
});
