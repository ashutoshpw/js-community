/**
 * Topic-related database schema definitions
 *
 * This module defines the schema for discussion topics and user-topic relationships
 * following Discourse's topic model architecture.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * Topics table - Discussion threads
 */
export const topics = pgTable(
  "topics",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: integer("category_id"),
    views: integer("views").default(0).notNull(),
    postsCount: integer("posts_count").default(0).notNull(),
    replyCount: integer("reply_count").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    highestPostNumber: integer("highest_post_number").default(0).notNull(),
    lastPostedAt: timestamp("last_posted_at"),
    lastReplyAt: timestamp("last_reply_at"),
    bumpedAt: timestamp("bumped_at"),
    pinned: boolean("pinned").default(false).notNull(),
    pinnedAt: timestamp("pinned_at"),
    pinnedGlobally: boolean("pinned_globally").default(false).notNull(),
    pinnedUntil: timestamp("pinned_until"),
    visible: boolean("visible").default(true).notNull(),
    closed: boolean("closed").default(false).notNull(),
    closedAt: timestamp("closed_at"),
    archived: boolean("archived").default(false).notNull(),
    archivedAt: timestamp("archived_at"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("topics_slug_idx").on(table.slug),
    userIdIdx: index("topics_user_id_idx").on(table.userId),
    categoryIdIdx: index("topics_category_id_idx").on(table.categoryId),
    bumpedAtIdx: index("topics_bumped_at_idx").on(table.bumpedAt),
    lastPostedAtIdx: index("topics_last_posted_at_idx").on(table.lastPostedAt),
    pinnedIdx: index("topics_pinned_idx").on(table.pinned),
    visibleIdx: index("topics_visible_idx").on(table.visible),
  }),
);

/**
 * Topic users table - Tracks user engagement with topics
 */
export const topicUsers = pgTable(
  "topic_users",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    posted: boolean("posted").default(false).notNull(),
    lastReadPostNumber: integer("last_read_post_number").default(0).notNull(),
    highestSeenPostNumber: integer("highest_seen_post_number")
      .default(0)
      .notNull(),
    lastVisitedAt: timestamp("last_visited_at"),
    firstVisitedAt: timestamp("first_visited_at"),
    notificationLevel: integer("notification_level").default(1).notNull(),
    notificationsChanged: boolean("notifications_changed")
      .default(false)
      .notNull(),
    notificationsReasonId: integer("notifications_reason_id"),
    liked: boolean("liked").default(false).notNull(),
    bookmarked: boolean("bookmarked").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdTopicIdIdx: index("topic_users_user_id_topic_id_idx").on(
      table.userId,
      table.topicId,
    ),
    topicIdIdx: index("topic_users_topic_id_idx").on(table.topicId),
    notificationLevelIdx: index("topic_users_notification_level_idx").on(
      table.notificationLevel,
    ),
  }),
);

/**
 * Relations definitions
 */
export const topicsRelations = relations(topics, ({ one, many }) => ({
  user: one(users, {
    fields: [topics.userId],
    references: [users.id],
  }),
  topicUsers: many(topicUsers),
}));

export const topicUsersRelations = relations(topicUsers, ({ one }) => ({
  user: one(users, {
    fields: [topicUsers.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [topicUsers.topicId],
    references: [topics.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type TopicUser = typeof topicUsers.$inferSelect;
export type NewTopicUser = typeof topicUsers.$inferInsert;
