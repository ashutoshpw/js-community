/**
 * User-related database schema definitions
 *
 * This module defines the schema for user accounts, emails, and profiles
 * following Discourse's user model architecture.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Main users table - Core user account information
 */
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    admin: boolean("admin").default(false).notNull(),
    moderator: boolean("moderator").default(false).notNull(),
    trustLevel: serial("trust_level").default(0).notNull(),
    active: boolean("active").default(true).notNull(),
    approved: boolean("approved").default(false).notNull(),
    suspended: boolean("suspended").default(false).notNull(),
    silenced: boolean("silenced").default(false).notNull(),
    suspendedAt: timestamp("suspended_at"),
    suspendedTill: timestamp("suspended_till"),
    silencedTill: timestamp("silenced_till"),
    lastSeenAt: timestamp("last_seen_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    usernameIdx: index("users_username_idx").on(table.username),
    emailIdx: index("users_email_idx").on(table.email),
    activeIdx: index("users_active_idx").on(table.active),
    lastSeenIdx: index("users_last_seen_at_idx").on(table.lastSeenAt),
  }),
);

/**
 * User emails table - Manages multiple email addresses per user
 */
export const userEmails = pgTable(
  "user_emails",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    primary: boolean("primary").default(false).notNull(),
    confirmed: boolean("confirmed").default(false).notNull(),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_emails_user_id_idx").on(table.userId),
    emailIdx: index("user_emails_email_idx").on(table.email),
  }),
);

/**
 * User profiles table - Extended user profile information
 */
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    location: varchar("location", { length: 255 }),
    website: varchar("website", { length: 500 }),
    bioRaw: text("bio_raw"),
    bioCooked: text("bio_cooked"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    profileBackgroundUrl: varchar("profile_background_url", { length: 500 }),
    cardBackgroundUrl: varchar("card_background_url", { length: 500 }),
    views: serial("views").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_profiles_user_id_idx").on(table.userId),
  }),
);

/**
 * Relations definitions
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  emails: many(userEmails),
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));

export const userEmailsRelations = relations(userEmails, ({ one }) => ({
  user: one(users, {
    fields: [userEmails.userId],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserEmail = typeof userEmails.$inferSelect;
export type NewUserEmail = typeof userEmails.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
