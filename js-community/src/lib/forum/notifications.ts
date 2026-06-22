/**
 * Create in-app forum notifications (Discourse-style types).
 */

import * as schema from "@/db/schema";
import {
  NOTIFICATION_TYPES,
  type NotificationData,
} from "@/db/schema/notifications";
import { db } from "@/lib/database";

interface CreateNotificationInput {
  userId: number;
  notificationType: keyof typeof NOTIFICATION_TYPES;
  topicId?: number | null;
  postId?: number | null;
  data?: NotificationData;
}

export async function createForumNotification(
  input: CreateNotificationInput,
): Promise<void> {
  const now = new Date();

  await db.insert(schema.notifications).values({
    userId: input.userId,
    notificationType: NOTIFICATION_TYPES[input.notificationType],
    topicId: input.topicId ?? null,
    postId: input.postId ?? null,
    data: input.data ?? {},
    read: false,
    highPriority: input.notificationType === "private_message",
    createdAt: now,
    updatedAt: now,
  });
}

export async function notifyPostLiked(options: {
  postAuthorId: number;
  actorId: number;
  actorUsername: string;
  topicId: number;
  postId: number;
  topicTitle: string;
}): Promise<void> {
  if (options.postAuthorId === options.actorId) {
    return;
  }

  await createForumNotification({
    userId: options.postAuthorId,
    notificationType: "liked",
    topicId: options.topicId,
    postId: options.postId,
    data: {
      display_username: options.actorUsername,
      topic_title: options.topicTitle,
      original_post_id: options.postId,
    },
  });
}

export async function notifyTopicReplied(options: {
  topicAuthorId: number;
  actorId: number;
  actorUsername: string;
  topicId: number;
  postId: number;
  topicTitle: string;
}): Promise<void> {
  if (options.topicAuthorId === options.actorId) {
    return;
  }

  await createForumNotification({
    userId: options.topicAuthorId,
    notificationType: "replied",
    topicId: options.topicId,
    postId: options.postId,
    data: {
      display_username: options.actorUsername,
      topic_title: options.topicTitle,
      original_post_id: options.postId,
    },
  });
}

export async function notifyPrivateMessage(options: {
  recipientId: number;
  senderId: number;
  senderUsername: string;
  conversationId: number;
  messagePreview: string;
}): Promise<void> {
  if (options.recipientId === options.senderId) {
    return;
  }

  await createForumNotification({
    userId: options.recipientId,
    notificationType: "private_message",
    topicId: options.conversationId,
    data: {
      display_username: options.senderUsername,
      topic_title: options.messagePreview.slice(0, 120),
    },
  });
}
