/**
 * Permission-related database schema definitions
 *
 * This module defines the schema for access control and authorization
 * following Discourse's Guardian pattern for permissions.
 */

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Permission types table - Defines available permission types
 */
export const permissionTypes = pgTable(
  "permission_types",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 500 }),
    value: integer("value").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("permission_types_name_idx").on(table.name),
    valueIdx: index("permission_types_value_idx").on(table.value),
  }),
);

/**
 * User actions table - Defines types of actions users can take
 */
export const userActionTypes = pgTable(
  "user_action_types",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("user_action_types_name_idx").on(table.name),
  }),
);

/**
 * Post action types table - Defines types of actions on posts
 */
export const postActionTypes = pgTable(
  "post_action_types",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 500 }),
    isFlag: integer("is_flag").default(0).notNull(),
    icon: varchar("icon", { length: 100 }),
    position: integer("position").default(0).notNull(),
    scoreBonus: integer("score_bonus").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("post_action_types_name_idx").on(table.name),
    isFlagIdx: index("post_action_types_is_flag_idx").on(table.isFlag),
    positionIdx: index("post_action_types_position_idx").on(table.position),
  }),
);

/**
 * Trust level grants table - Track trust level grants to users
 */
export const trustLevelGrants = pgTable(
  "trust_level_grants",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    trustLevel: integer("trust_level").notNull(),
    grantedById: integer("granted_by_id"),
    reason: varchar("reason", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("trust_level_grants_user_id_idx").on(table.userId),
    trustLevelIdx: index("trust_level_grants_trust_level_idx").on(
      table.trustLevel,
    ),
    grantedByIdIdx: index("trust_level_grants_granted_by_id_idx").on(
      table.grantedById,
    ),
  }),
);

/**
 * User badges table - Track badges awarded to users
 */
export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    badgeId: integer("badge_id").notNull(),
    userId: integer("user_id").notNull(),
    grantedById: integer("granted_by_id"),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
    postId: integer("post_id"),
    notificationId: integer("notification_id"),
    seq: integer("seq").default(0).notNull(),
    featured: integer("featured").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdBadgeIdIdx: index("user_badges_user_id_badge_id_idx").on(
      table.userId,
      table.badgeId,
    ),
    badgeIdIdx: index("user_badges_badge_id_idx").on(table.badgeId),
    userIdIdx: index("user_badges_user_id_idx").on(table.userId),
    featuredIdx: index("user_badges_featured_idx").on(table.featured),
  }),
);

/**
 * Badges table - Defines available badges
 */
export const badges = pgTable(
  "badges",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }),
    badgeTypeId: integer("badge_type_id").notNull(),
    grantCount: integer("grant_count").default(0).notNull(),
    allowTitle: integer("allow_title").default(0).notNull(),
    multiple: integer("multiple").default(0).notNull(),
    icon: varchar("icon", { length: 100 }),
    listable: integer("listable").default(1).notNull(),
    targetPosts: integer("target_posts").default(0).notNull(),
    enabled: integer("enabled").default(1).notNull(),
    autoRevoke: integer("auto_revoke").default(1).notNull(),
    badgeGroupingId: integer("badge_grouping_id").default(5).notNull(),
    system: integer("system").default(0).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    longDescription: varchar("long_description", { length: 2000 }),
    showPosts: integer("show_posts").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("badges_name_idx").on(table.name),
    badgeTypeIdIdx: index("badges_badge_type_id_idx").on(table.badgeTypeId),
    enabledIdx: index("badges_enabled_idx").on(table.enabled),
  }),
);

/**
 * Relations definitions
 */
export const permissionTypesRelations = relations(permissionTypes, () => ({}));

export const userActionTypesRelations = relations(userActionTypes, () => ({}));

export const postActionTypesRelations = relations(postActionTypes, () => ({}));

export const trustLevelGrantsRelations = relations(
  trustLevelGrants,
  () => ({}),
);

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

/**
 * TypeScript types derived from schema
 */
export type PermissionType = typeof permissionTypes.$inferSelect;
export type NewPermissionType = typeof permissionTypes.$inferInsert;
export type UserActionType = typeof userActionTypes.$inferSelect;
export type NewUserActionType = typeof userActionTypes.$inferInsert;
export type PostActionType = typeof postActionTypes.$inferSelect;
export type NewPostActionType = typeof postActionTypes.$inferInsert;
export type TrustLevelGrant = typeof trustLevelGrants.$inferSelect;
export type NewTrustLevelGrant = typeof trustLevelGrants.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
