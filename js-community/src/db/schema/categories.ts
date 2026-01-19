/**
 * Category-related database schema definitions
 *
 * This module defines the schema for hierarchical topic organization
 * following Discourse's category model architecture.
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
import { groups } from "./groups";
import { categoryTags } from "./tags";
import { topics } from "./topics";
import { users } from "./users";

/**
 * Categories table - Hierarchical topic organization
 */
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    color: varchar("color", { length: 6 }).notNull(),
    textColor: varchar("text_color", { length: 6 }).default("FFFFFF").notNull(),
    description: text("description"),
    topicId: integer("topic_id"),
    topicCount: integer("topic_count").default(0).notNull(),
    postCount: integer("post_count").default(0).notNull(),
    position: integer("position").default(0).notNull(),
    parentCategoryId: integer("parent_category_id").references(
      (): any => categories.id,
      { onDelete: "set null" },
    ),
    uploadedLogoId: integer("uploaded_logo_id"),
    uploadedBackgroundId: integer("uploaded_background_id"),
    readRestricted: boolean("read_restricted").default(false).notNull(),
    autoCloseHours: integer("auto_close_hours"),
    autoCloseBased: integer("auto_close_based").default(3).notNull(),
    allowBadges: boolean("allow_badges").default(true).notNull(),
    topicFeaturedLinkAllowed: boolean("topic_featured_link_allowed")
      .default(true)
      .notNull(),
    showSubcategoryList: boolean("show_subcategory_list")
      .default(false)
      .notNull(),
    numFeaturedTopics: integer("num_featured_topics").default(3).notNull(),
    defaultView: varchar("default_view", { length: 50 }).default("latest"),
    subcategoryListStyle: varchar("subcategory_list_style", { length: 50 })
      .default("rows_with_featured_topics")
      .notNull(),
    defaultTopPeriod: varchar("default_top_period", { length: 20 }).default(
      "all",
    ),
    mailingListMode: boolean("mailing_list_mode").default(false).notNull(),
    minimumRequiredTags: integer("minimum_required_tags").default(0).notNull(),
    navigateToFirstPostAfterRead: boolean("navigate_to_first_post_after_read")
      .default(false)
      .notNull(),
    sortOrder: varchar("sort_order", { length: 50 }),
    sortAscending: boolean("sort_ascending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("categories_slug_idx").on(table.slug),
    nameIdx: index("categories_name_idx").on(table.name),
    parentCategoryIdIdx: index("categories_parent_category_id_idx").on(
      table.parentCategoryId,
    ),
    positionIdx: index("categories_position_idx").on(table.position),
  }),
);

/**
 * Category users table - User-specific category settings
 */
export const categoryUsers = pgTable(
  "category_users",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notificationLevel: integer("notification_level").default(1).notNull(),
    lastSeenAt: timestamp("last_seen_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdUserIdIdx: index("category_users_category_id_user_id_idx").on(
      table.categoryId,
      table.userId,
    ),
    userIdIdx: index("category_users_user_id_idx").on(table.userId),
    notificationLevelIdx: index("category_users_notification_level_idx").on(
      table.notificationLevel,
    ),
  }),
);

/**
 * Category groups table - Category permission groups
 */
export const categoryGroups = pgTable(
  "category_groups",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    permissionType: integer("permission_type").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdGroupIdIdx: index("category_groups_category_id_group_id_idx").on(
      table.categoryId,
      table.groupId,
    ),
    groupIdIdx: index("category_groups_group_id_idx").on(table.groupId),
  }),
);

/**
 * Relations definitions
 */
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
    relationName: "categoryHierarchy",
  }),
  subcategories: many(categories, {
    relationName: "categoryHierarchy",
  }),
  topics: many(topics),
  categoryUsers: many(categoryUsers),
  categoryGroups: many(categoryGroups),
  categoryTags: many(categoryTags),
}));

export const categoryUsersRelations = relations(categoryUsers, ({ one }) => ({
  category: one(categories, {
    fields: [categoryUsers.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [categoryUsers.userId],
    references: [users.id],
  }),
}));

export const categoryGroupsRelations = relations(categoryGroups, ({ one }) => ({
  category: one(categories, {
    fields: [categoryGroups.categoryId],
    references: [categories.id],
  }),
  group: one(groups, {
    fields: [categoryGroups.groupId],
    references: [groups.id],
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type CategoryUser = typeof categoryUsers.$inferSelect;
export type NewCategoryUser = typeof categoryUsers.$inferInsert;
export type CategoryGroup = typeof categoryGroups.$inferSelect;
export type NewCategoryGroup = typeof categoryGroups.$inferInsert;
