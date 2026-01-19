/**
 * Tag-related database schema definitions
 *
 * This module defines the schema for flexible topic labeling and tag management
 * following Discourse's tag model architecture.
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
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { topics } from "./topics";
import { users } from "./users";

/**
 * Tags table - Topic labels/keywords
 */
export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    topicCount: integer("topic_count").default(0).notNull(),
    pmTopicCount: integer("pm_topic_count").default(0).notNull(),
    targetTagId: integer("target_tag_id"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("tags_name_idx").on(table.name),
    topicCountIdx: index("tags_topic_count_idx").on(table.topicCount),
  }),
);

/**
 * Tag groups table - Grouping tags into categories
 */
export const tagGroups = pgTable(
  "tag_groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    parentTagId: integer("parent_tag_id"),
    onePerTopic: boolean("one_per_topic").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("tag_groups_name_idx").on(table.name),
  }),
);

/**
 * Tag group memberships table - Many-to-many relationship between tags and tag groups
 */
export const tagGroupMemberships = pgTable(
  "tag_group_memberships",
  {
    id: serial("id").primaryKey(),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    tagGroupId: integer("tag_group_id")
      .notNull()
      .references(() => tagGroups.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tagIdGroupIdIdx: index("tag_group_memberships_tag_id_group_id_idx").on(
      table.tagId,
      table.tagGroupId,
    ),
    tagGroupIdIdx: index("tag_group_memberships_tag_group_id_idx").on(
      table.tagGroupId,
    ),
  }),
);

/**
 * Topic tags table - Many-to-many relationship between topics and tags
 */
export const topicTags = pgTable(
  "topic_tags",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    topicIdTagIdIdx: index("topic_tags_topic_id_tag_id_idx").on(
      table.topicId,
      table.tagId,
    ),
    tagIdIdx: index("topic_tags_tag_id_idx").on(table.tagId),
    topicIdIdx: index("topic_tags_topic_id_idx").on(table.topicId),
  }),
);

/**
 * Category tags table - Allowed/required tags per category
 */
export const categoryTags = pgTable(
  "category_tags",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdTagIdIdx: index("category_tags_category_id_tag_id_idx").on(
      table.categoryId,
      table.tagId,
    ),
    tagIdIdx: index("category_tags_tag_id_idx").on(table.tagId),
  }),
);

/**
 * Tag users table - User watching/muting tags
 */
export const tagUsers = pgTable(
  "tag_users",
  {
    id: serial("id").primaryKey(),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notificationLevel: integer("notification_level").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tagIdUserIdIdx: index("tag_users_tag_id_user_id_idx").on(
      table.tagId,
      table.userId,
    ),
    userIdIdx: index("tag_users_user_id_idx").on(table.userId),
  }),
);

/**
 * Relations definitions
 */
export const tagsRelations = relations(tags, ({ many }) => ({
  topicTags: many(topicTags),
  categoryTags: many(categoryTags),
  tagGroupMemberships: many(tagGroupMemberships),
  tagUsers: many(tagUsers),
}));

export const tagGroupsRelations = relations(tagGroups, ({ many }) => ({
  tagGroupMemberships: many(tagGroupMemberships),
}));

export const tagGroupMembershipsRelations = relations(
  tagGroupMemberships,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagGroupMemberships.tagId],
      references: [tags.id],
    }),
    tagGroup: one(tagGroups, {
      fields: [tagGroupMemberships.tagGroupId],
      references: [tagGroups.id],
    }),
  }),
);

export const topicTagsRelations = relations(topicTags, ({ one }) => ({
  topic: one(topics, {
    fields: [topicTags.topicId],
    references: [topics.id],
  }),
  tag: one(tags, {
    fields: [topicTags.tagId],
    references: [tags.id],
  }),
}));

export const categoryTagsRelations = relations(categoryTags, ({ one }) => ({
  tag: one(tags, {
    fields: [categoryTags.tagId],
    references: [tags.id],
  }),
  category: one(categories, {
    fields: [categoryTags.categoryId],
    references: [categories.id],
  }),
}));

export const tagUsersRelations = relations(tagUsers, ({ one }) => ({
  tag: one(tags, {
    fields: [tagUsers.tagId],
    references: [tags.id],
  }),
  user: one(users, {
    fields: [tagUsers.userId],
    references: [users.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type TagGroup = typeof tagGroups.$inferSelect;
export type NewTagGroup = typeof tagGroups.$inferInsert;
export type TagGroupMembership = typeof tagGroupMemberships.$inferSelect;
export type NewTagGroupMembership = typeof tagGroupMemberships.$inferInsert;
export type TopicTag = typeof topicTags.$inferSelect;
export type NewTopicTag = typeof topicTags.$inferInsert;
export type CategoryTag = typeof categoryTags.$inferSelect;
export type NewCategoryTag = typeof categoryTags.$inferInsert;
export type TagUser = typeof tagUsers.$inferSelect;
export type NewTagUser = typeof tagUsers.$inferInsert;
