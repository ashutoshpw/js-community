/**
 * User Actions database schema definitions
 *
 * This module defines the schema for tracking user activity
 * following Discourse's UserAction model.
 */

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { topics } from "./topics";
import { users } from "./users";

/**
 * User action types enum values
 * Following Discourse user action types
 */
export const USER_ACTION_TYPES = {
  like: 1,
  was_liked: 2,
  bookmark: 3,
  new_topic: 4,
  reply: 5,
  response: 6, // someone replied to their post
  mention: 7,
  quote: 9,
  edit: 11,
  new_private_message: 12,
  got_private_message: 13,
  solved: 15,
  assigned: 16,
} as const;

export type UserActionTypeKey = keyof typeof USER_ACTION_TYPES;

/**
 * User actions table - Activity tracking
 */
export const userActions = pgTable(
  "user_actions",
  {
    id: serial("id").primaryKey(),
    actionType: integer("action_type").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetTopicId: integer("target_topic_id").references(() => topics.id, {
      onDelete: "cascade",
    }),
    targetPostId: integer("target_post_id").references(() => posts.id, {
      onDelete: "cascade",
    }),
    targetUserId: integer("target_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    actingUserId: integer("acting_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_actions_user_id_idx").on(table.userId),
    userIdActionTypeIdx: index("user_actions_user_id_action_type_idx").on(
      table.userId,
      table.actionType,
    ),
    targetUserIdIdx: index("user_actions_target_user_id_idx").on(
      table.targetUserId,
    ),
    actingUserIdIdx: index("user_actions_acting_user_id_idx").on(
      table.actingUserId,
    ),
    createdAtIdx: index("user_actions_created_at_idx").on(table.createdAt),
    topicIdIdx: index("user_actions_target_topic_id_idx").on(
      table.targetTopicId,
    ),
    postIdIdx: index("user_actions_target_post_id_idx").on(table.targetPostId),
  }),
);

/**
 * User stats table - Aggregate statistics
 */
export const userStats = pgTable(
  "user_stats",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    topicsEntered: integer("topics_entered").default(0).notNull(),
    postsReadCount: integer("posts_read_count").default(0).notNull(),
    daysVisited: integer("days_visited").default(0).notNull(),
    topicCount: integer("topic_count").default(0).notNull(),
    postCount: integer("post_count").default(0).notNull(),
    likesGiven: integer("likes_given").default(0).notNull(),
    likesReceived: integer("likes_received").default(0).notNull(),
    firstPostCreatedAt: timestamp("first_post_created_at"),
    timeRead: integer("time_read").default(0).notNull(), // in seconds
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_stats_user_id_idx").on(table.userId),
  }),
);

/**
 * Relations definitions
 */
export const userActionsRelations = relations(userActions, ({ one }) => ({
  user: one(users, {
    fields: [userActions.userId],
    references: [users.id],
    relationName: "user_actions",
  }),
  targetUser: one(users, {
    fields: [userActions.targetUserId],
    references: [users.id],
    relationName: "target_user_actions",
  }),
  actingUser: one(users, {
    fields: [userActions.actingUserId],
    references: [users.id],
    relationName: "acting_user_actions",
  }),
  topic: one(topics, {
    fields: [userActions.targetTopicId],
    references: [topics.id],
  }),
  post: one(posts, {
    fields: [userActions.targetPostId],
    references: [posts.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type UserAction = typeof userActions.$inferSelect;
export type NewUserAction = typeof userActions.$inferInsert;
export type UserStat = typeof userStats.$inferSelect;
export type NewUserStat = typeof userStats.$inferInsert;
