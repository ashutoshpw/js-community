/**
 * Moderation Schema
 *
 * Tables for review queue and moderation actions.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Reviewable items - flagged content that needs moderator attention
 */
export const reviewables = pgTable("reviewables", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // post, topic, user
  status: text("status").notNull().default("pending"), // pending, approved, rejected, ignored
  targetId: integer("target_id").notNull(),
  targetType: text("target_type").notNull(), // post, topic, user
  createdById: integer("created_by_id"), // User who flagged (null for system flags)
  reviewedById: integer("reviewed_by_id"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  score: integer("score").default(0),
  potentialSpam: boolean("potential_spam").default(false),
  forceReview: boolean("force_review").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Reviewable scores - individual flags/reports on a reviewable
 */
export const reviewableScores = pgTable("reviewable_scores", {
  id: serial("id").primaryKey(),
  reviewableId: integer("reviewable_id").notNull(),
  userId: integer("user_id").notNull(),
  reviewableScoreType: text("reviewable_score_type").notNull(), // spam, inappropriate, off_topic, etc.
  score: integer("score").default(1),
  reason: text("reason"),
  meta: text("meta"), // JSON string with additional data
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Moderator actions - audit log for all moderation activities
 */
export const moderatorActions = pgTable("moderator_actions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Moderator who took the action
  action: text("action").notNull(), // delete_post, lock_topic, silence_user, etc.
  targetType: text("target_type").notNull(), // post, topic, user
  targetId: integer("target_id").notNull(),
  reason: text("reason"),
  details: text("details"), // JSON string with action-specific details
  reviewableId: integer("reviewable_id"), // Link to reviewable if applicable
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * User warnings - warnings issued to users by moderators
 */
export const userWarnings = pgTable("user_warnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  issuedById: integer("issued_by_id").notNull(),
  reason: text("reason").notNull(),
  level: integer("level").default(1), // 1 = warning, 2 = final warning, 3 = ban
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  relatedPostId: integer("related_post_id"),
  relatedTopicId: integer("related_topic_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const reviewablesRelations = relations(reviewables, ({ many }) => ({
  scores: many(reviewableScores),
}));

export const reviewableScoresRelations = relations(
  reviewableScores,
  ({ one }) => ({
    reviewable: one(reviewables, {
      fields: [reviewableScores.reviewableId],
      references: [reviewables.id],
    }),
  }),
);

export const moderatorActionsRelations = relations(
  moderatorActions,
  ({ one }) => ({
    reviewable: one(reviewables, {
      fields: [moderatorActions.reviewableId],
      references: [reviewables.id],
    }),
  }),
);

// Types
export type Reviewable = typeof reviewables.$inferSelect;
export type NewReviewable = typeof reviewables.$inferInsert;
export type ReviewableScore = typeof reviewableScores.$inferSelect;
export type NewReviewableScore = typeof reviewableScores.$inferInsert;
export type ModeratorAction = typeof moderatorActions.$inferSelect;
export type NewModeratorAction = typeof moderatorActions.$inferInsert;
export type UserWarning = typeof userWarnings.$inferSelect;
export type NewUserWarning = typeof userWarnings.$inferInsert;
