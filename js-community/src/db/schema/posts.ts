/**
 * Post-related database schema definitions
 *
 * This module defines the schema for posts, post actions, and post revisions
 * following Discourse's post model architecture.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { topics } from "./topics";
import { users } from "./users";

/**
 * Posts table - Individual messages within topics
 */
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    postNumber: integer("post_number").notNull(),
    raw: text("raw").notNull(),
    cooked: text("cooked").notNull(),
    replyToPostNumber: integer("reply_to_post_number"),
    replyCount: integer("reply_count").default(0).notNull(),
    quoteCount: integer("quote_count").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    reads: integer("reads").default(0).notNull(),
    score: integer("score").default(0).notNull(),
    hidden: boolean("hidden").default(false).notNull(),
    hiddenAt: timestamp("hidden_at"),
    hiddenReasonId: integer("hidden_reason_id"),
    wiki: boolean("wiki").default(false).notNull(),
    version: integer("version").default(1).notNull(),
    lastVersionAt: timestamp("last_version_at"),
    deletedAt: timestamp("deleted_at"),
    deletedById: integer("deleted_by_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("posts_user_id_idx").on(table.userId),
    topicIdIdx: index("posts_topic_id_idx").on(table.topicId),
    topicIdPostNumberIdx: index("posts_topic_id_post_number_idx").on(
      table.topicId,
      table.postNumber,
    ),
    createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
    hiddenIdx: index("posts_hidden_idx").on(table.hidden),
  }),
);

/**
 * Post actions table - User actions on posts (likes, flags, bookmarks)
 */
export const postActions = pgTable(
  "post_actions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postActionTypeId: integer("post_action_type_id").notNull(),
    deletedAt: timestamp("deleted_at"),
    deletedById: integer("deleted_by_id"),
    relatedPostId: integer("related_post_id"),
    staffTookAction: boolean("staff_took_action").default(false).notNull(),
    deferredById: integer("deferred_by_id"),
    deferredAt: timestamp("deferred_at"),
    agreedAt: timestamp("agreed_at"),
    agreedById: integer("agreed_by_id"),
    disagreedAt: timestamp("disagreed_at"),
    disagreedById: integer("disagreed_by_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdIdx: index("post_actions_post_id_idx").on(table.postId),
    userIdIdx: index("post_actions_user_id_idx").on(table.userId),
    postIdUserIdTypeIdx: index("post_actions_post_id_user_id_type_idx").on(
      table.postId,
      table.userId,
      table.postActionTypeId,
    ),
  }),
);

/**
 * Post revisions table - History of post edits
 */
export const postRevisions = pgTable(
  "post_revisions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    number: integer("number").notNull(),
    modifications: text("modifications"),
    hidden: boolean("hidden").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdIdx: index("post_revisions_post_id_idx").on(table.postId),
    postIdNumberIdx: index("post_revisions_post_id_number_idx").on(
      table.postId,
      table.number,
    ),
    createdAtIdx: index("post_revisions_created_at_idx").on(table.createdAt),
  }),
);

/**
 * Relations definitions
 */
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [posts.topicId],
    references: [topics.id],
  }),
  postActions: many(postActions),
  postRevisions: many(postRevisions),
}));

export const postActionsRelations = relations(postActions, ({ one }) => ({
  post: one(posts, {
    fields: [postActions.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postActions.userId],
    references: [users.id],
  }),
}));

export const postRevisionsRelations = relations(postRevisions, ({ one }) => ({
  post: one(posts, {
    fields: [postRevisions.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postRevisions.userId],
    references: [users.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostAction = typeof postActions.$inferSelect;
export type NewPostAction = typeof postActions.$inferInsert;
export type PostRevision = typeof postRevisions.$inferSelect;
export type NewPostRevision = typeof postRevisions.$inferInsert;
