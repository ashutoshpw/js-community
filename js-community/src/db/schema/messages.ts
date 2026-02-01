/**
 * Private Messages database schema definitions
 *
 * This module defines the schema for private messaging
 * following Discourse's private message model.
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
import { users } from "./users";

/**
 * Conversations table - Groups messages between participants
 */
export const conversations = pgTable(
  "conversations",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    messageCount: integer("message_count").default(0).notNull(),
    isGroup: boolean("is_group").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
  },
  (table) => ({
    createdByIdx: index("conversations_created_by_idx").on(table.createdById),
    lastMessageAtIdx: index("conversations_last_message_at_idx").on(
      table.lastMessageAt,
    ),
  }),
);

/**
 * Conversation Participants - Users in a conversation
 */
export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastReadAt: timestamp("last_read_at"),
    isAdmin: boolean("is_admin").default(false).notNull(),
    isMuted: boolean("is_muted").default(false).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
  },
  (table) => ({
    conversationIdIdx: index("conv_participants_conversation_idx").on(
      table.conversationId,
    ),
    userIdIdx: index("conv_participants_user_idx").on(table.userId),
    uniqueParticipant: index("conv_participants_unique_idx").on(
      table.conversationId,
      table.userId,
    ),
  }),
);

/**
 * Private Messages - Individual messages in a conversation
 */
export const privateMessages = pgTable(
  "private_messages",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: integer("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    raw: text("raw").notNull(),
    cooked: text("cooked"),
    messageNumber: integer("message_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    conversationIdIdx: index("private_messages_conversation_idx").on(
      table.conversationId,
    ),
    senderIdIdx: index("private_messages_sender_idx").on(table.senderId),
    createdAtIdx: index("private_messages_created_at_idx").on(table.createdAt),
  }),
);

/**
 * Relations definitions
 */
export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [conversations.createdById],
      references: [users.id],
    }),
    participants: many(conversationParticipants),
    messages: many(privateMessages),
  }),
);

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  }),
);

export const privateMessagesRelations = relations(
  privateMessages,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [privateMessages.conversationId],
      references: [conversations.id],
    }),
    sender: one(users, {
      fields: [privateMessages.senderId],
      references: [users.id],
    }),
  }),
);

/**
 * TypeScript types derived from schema
 */
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type ConversationParticipant =
  typeof conversationParticipants.$inferSelect;
export type NewConversationParticipant =
  typeof conversationParticipants.$inferInsert;
export type PrivateMessage = typeof privateMessages.$inferSelect;
export type NewPrivateMessage = typeof privateMessages.$inferInsert;
