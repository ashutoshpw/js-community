/**
 * Notification-related database schema definitions
 *
 * This module defines the schema for user notifications
 * following Discourse's notification model architecture.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * Notification types enum values
 * Following Discourse notification types
 */
export const NOTIFICATION_TYPES = {
  mentioned: 1,
  replied: 2,
  quoted: 3,
  liked: 4,
  posted: 5,
  private_message: 6,
  invited_to_topic: 7,
  badge_earned: 8,
  topic_linked: 9,
  watching_first_post: 10,
  trust_level_change: 11,
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;

/**
 * Notifications table - User notifications
 */
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notificationType: integer("notification_type").notNull(),
    data: jsonb("data").$type<NotificationData>(),
    read: boolean("read").default(false).notNull(),
    highPriority: boolean("high_priority").default(false).notNull(),
    topicId: integer("topic_id"),
    postId: integer("post_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    userIdReadIdx: index("notifications_user_id_read_idx").on(
      table.userId,
      table.read,
    ),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    topicIdIdx: index("notifications_topic_id_idx").on(table.topicId),
    postIdIdx: index("notifications_post_id_idx").on(table.postId),
  }),
);

/**
 * Notification preferences table - Per-user notification settings
 */
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    emailOnMention: boolean("email_on_mention").default(true).notNull(),
    emailOnReply: boolean("email_on_reply").default(true).notNull(),
    emailOnQuote: boolean("email_on_quote").default(true).notNull(),
    emailOnLike: boolean("email_on_like").default(false).notNull(),
    emailOnPrivateMessage: boolean("email_on_private_message")
      .default(true)
      .notNull(),
    emailDigestFrequency: varchar("email_digest_frequency", { length: 20 })
      .default("daily")
      .notNull(),
    mutedCategories: jsonb("muted_categories").$type<number[]>().default([]),
    mutedTags: jsonb("muted_tags").$type<number[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notification_preferences_user_id_idx").on(table.userId),
  }),
);

/**
 * Notification data structure
 */
export interface NotificationData {
  display_username?: string;
  original_username?: string;
  topic_title?: string;
  original_post_id?: number;
  original_post_type?: number;
  revision_number?: number;
  badge_id?: number;
  badge_name?: string;
  [key: string]: unknown;
}

/**
 * Relations definitions
 */
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationPreferencesRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationPreferences.userId],
      references: [users.id],
    }),
  }),
);

/**
 * TypeScript types derived from schema
 */
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationPreference =
  typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference =
  typeof notificationPreferences.$inferInsert;
