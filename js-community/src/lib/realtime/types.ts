/**
 * Real-time event types and interfaces
 */

export type RealtimeEventType =
  | "post:created"
  | "post:updated"
  | "post:deleted"
  | "topic:created"
  | "topic:updated"
  | "notification:new"
  | "presence:join"
  | "presence:leave"
  | "typing:start"
  | "typing:stop";

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  channel: string;
  data: T;
  timestamp: number;
  userId?: number;
}

export interface PostEvent {
  id: number;
  topicId: number;
  postNumber: number;
  userId: number;
  username: string;
  raw?: string;
  cooked?: string;
}

export interface TopicEvent {
  id: number;
  title: string;
  categoryId: number | null;
  userId: number;
  username: string;
}

export interface NotificationEvent {
  id: number;
  notificationType: number;
  data: Record<string, unknown>;
  topicId: number | null;
  postId: number | null;
}

export interface PresenceEvent {
  userId: number;
  username: string;
  channel: string;
}

export interface TypingEvent {
  userId: number;
  username: string;
  topicId: number;
}

export type ChannelType = "topic" | "category" | "user" | "global";

export interface Channel {
  type: ChannelType;
  id: string;
  name: string;
}

/**
 * Generate channel name for subscriptions
 */
export function getChannelName(
  type: ChannelType,
  id?: number | string,
): string {
  switch (type) {
    case "topic":
      return `/topic/${id}`;
    case "category":
      return `/category/${id}`;
    case "user":
      return `/user/${id}`;
    case "global":
      return "/global";
    default:
      return "/global";
  }
}
