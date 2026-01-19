/**
 * Group-related database schema definitions
 *
 * This module defines the schema for user organization and permissions
 * following Discourse's group model architecture.
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
import { categoryGroups } from "./categories";
import { users } from "./users";

/**
 * Groups table - User organization and permissions
 */
export const groups = pgTable(
  "groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }),
    bioRaw: text("bio_raw"),
    bioCooked: text("bio_cooked"),
    visibility: integer("visibility").default(0).notNull(),
    public: boolean("public").default(false).notNull(),
    allowMembershipRequests: boolean("allow_membership_requests")
      .default(false)
      .notNull(),
    membershipRequestTemplate: text("membership_request_template"),
    fullName: varchar("full_name", { length: 255 }),
    userCount: integer("user_count").default(0).notNull(),
    mentionableLevel: integer("mentionable_level").default(0).notNull(),
    messagableLevel: integer("messagable_level").default(0).notNull(),
    flairUrl: varchar("flair_url", { length: 500 }),
    flairBgColor: varchar("flair_bg_color", { length: 6 }),
    flairColor: varchar("flair_color", { length: 6 }),
    primaryGroup: boolean("primary_group").default(false).notNull(),
    title: varchar("title", { length: 255 }),
    grantTrustLevel: integer("grant_trust_level"),
    incomingEmail: varchar("incoming_email", { length: 255 }),
    hasMessages: boolean("has_messages").default(false).notNull(),
    publishReadState: boolean("publish_read_state").default(false).notNull(),
    membersVisibilityLevel: integer("members_visibility_level")
      .default(0)
      .notNull(),
    canAdminGroup: boolean("can_admin_group").default(false).notNull(),
    defaultNotificationLevel: integer("default_notification_level")
      .default(3)
      .notNull(),
    automaticMembershipEmailDomains: text("automatic_membership_email_domains"),
    automaticMembershipRetroactive: boolean("automatic_membership_retroactive")
      .default(false)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("groups_name_idx").on(table.name),
    publicIdx: index("groups_public_idx").on(table.public),
    visibilityIdx: index("groups_visibility_idx").on(table.visibility),
  }),
);

/**
 * Group users table - Many-to-many relationship between users and groups
 */
export const groupUsers = pgTable(
  "group_users",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    owner: boolean("owner").default(false).notNull(),
    notificationLevel: integer("notification_level").default(2).notNull(),
    firstUnreadPmAt: timestamp("first_unread_pm_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdUserIdIdx: index("group_users_group_id_user_id_idx").on(
      table.groupId,
      table.userId,
    ),
    userIdIdx: index("group_users_user_id_idx").on(table.userId),
    ownerIdx: index("group_users_owner_idx").on(table.owner),
  }),
);

/**
 * Group mentions table - Track when groups are mentioned
 */
export const groupMentions = pgTable(
  "group_mentions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id").notNull(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdGroupIdIdx: index("group_mentions_post_id_group_id_idx").on(
      table.postId,
      table.groupId,
    ),
    groupIdIdx: index("group_mentions_group_id_idx").on(table.groupId),
  }),
);

/**
 * Group histories table - Track group membership changes
 */
export const groupHistories = pgTable(
  "group_histories",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    actingUserId: integer("acting_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    targetUserId: integer("target_user_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    action: integer("action").notNull(),
    subject: varchar("subject", { length: 255 }),
    prevValue: text("prev_value"),
    newValue: text("new_value"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    groupIdIdx: index("group_histories_group_id_idx").on(table.groupId),
    actingUserIdIdx: index("group_histories_acting_user_id_idx").on(
      table.actingUserId,
    ),
    targetUserIdIdx: index("group_histories_target_user_id_idx").on(
      table.targetUserId,
    ),
    actionIdx: index("group_histories_action_idx").on(table.action),
  }),
);

/**
 * Relations definitions
 */
export const groupsRelations = relations(groups, ({ many }) => ({
  groupUsers: many(groupUsers),
  groupMentions: many(groupMentions),
  groupHistories: many(groupHistories),
  categoryGroups: many(categoryGroups),
}));

export const groupUsersRelations = relations(groupUsers, ({ one }) => ({
  group: one(groups, {
    fields: [groupUsers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupUsers.userId],
    references: [users.id],
  }),
}));

export const groupMentionsRelations = relations(groupMentions, ({ one }) => ({
  group: one(groups, {
    fields: [groupMentions.groupId],
    references: [groups.id],
  }),
}));

export const groupHistoriesRelations = relations(groupHistories, ({ one }) => ({
  group: one(groups, {
    fields: [groupHistories.groupId],
    references: [groups.id],
  }),
  actingUser: one(users, {
    fields: [groupHistories.actingUserId],
    references: [users.id],
    relationName: "actingUser",
  }),
  targetUser: one(users, {
    fields: [groupHistories.targetUserId],
    references: [users.id],
    relationName: "targetUser",
  }),
}));

/**
 * TypeScript types derived from schema
 */
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupUser = typeof groupUsers.$inferSelect;
export type NewGroupUser = typeof groupUsers.$inferInsert;
export type GroupMention = typeof groupMentions.$inferSelect;
export type NewGroupMention = typeof groupMentions.$inferInsert;
export type GroupHistory = typeof groupHistories.$inferSelect;
export type NewGroupHistory = typeof groupHistories.$inferInsert;
