/**
 * Bookmark-related database schema definitions
 *
 * This module defines enhanced bookmarks with notes and reminders
 * following Discourse's bookmark model.
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
import { posts } from "./posts";
import { topics } from "./topics";
import { users } from "./users";

/**
 * Bookmarks table - Enhanced bookmarks with notes
 */
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: integer("post_id").references(() => posts.id, {
      onDelete: "cascade",
    }),
    topicId: integer("topic_id").references(() => topics.id, {
      onDelete: "cascade",
    }),
    name: text("name"),
    reminderAt: timestamp("reminder_at"),
    reminderType: integer("reminder_type"),
    reminderLastSentAt: timestamp("reminder_last_sent_at"),
    reminderSetAt: timestamp("reminder_set_at"),
    autoDeletePreference: integer("auto_delete_preference").default(0),
    pinned: boolean("pinned").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("bookmarks_user_id_idx").on(table.userId),
    postIdIdx: index("bookmarks_post_id_idx").on(table.postId),
    topicIdIdx: index("bookmarks_topic_id_idx").on(table.topicId),
    userIdPostIdIdx: index("bookmarks_user_id_post_id_idx").on(
      table.userId,
      table.postId,
    ),
    reminderAtIdx: index("bookmarks_reminder_at_idx").on(table.reminderAt),
    pinnedIdx: index("bookmarks_pinned_idx").on(table.pinned),
  }),
);

/**
 * Relations definitions
 */
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
  topic: one(topics, {
    fields: [bookmarks.topicId],
    references: [topics.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
