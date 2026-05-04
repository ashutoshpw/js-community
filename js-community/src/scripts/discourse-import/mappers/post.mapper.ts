/**
 * Discourse Import — Post mapper
 */

import type { NewPost } from "@/db/schema";

export interface DiscoursePost {
  id: number;
  user_id: number;
  topic_id: number;
  post_number: number;
  raw: string;
  cooked?: string;
  reply_to_post_number?: number | null;
  reply_count?: number;
  quote_count?: number;
  like_count?: number;
  reads?: number;
  score?: number;
  hidden?: boolean;
  hidden_at?: string | null;
  hidden_reason_id?: number | null;
  wiki?: boolean;
  version?: number;
  last_version_at?: string | null;
  deleted_at?: string | null;
  deleted_by_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export function mapPost(
  d: DiscoursePost,
  newUserId: number,
  newTopicId: number,
): NewPost {
  const now = new Date();
  return {
    userId: newUserId,
    topicId: newTopicId,
    postNumber: d.post_number,
    raw: d.raw,
    cooked: d.cooked ?? d.raw,
    replyToPostNumber: d.reply_to_post_number ?? null,
    replyCount: d.reply_count ?? 0,
    quoteCount: d.quote_count ?? 0,
    likeCount: d.like_count ?? 0,
    reads: d.reads ?? 0,
    score: d.score ?? 0,
    hidden: d.hidden ?? false,
    hiddenAt: d.hidden_at ? new Date(d.hidden_at) : null,
    hiddenReasonId: d.hidden_reason_id ?? null,
    wiki: d.wiki ?? false,
    version: d.version ?? 1,
    lastVersionAt: d.last_version_at ? new Date(d.last_version_at) : null,
    deletedAt: d.deleted_at ? new Date(d.deleted_at) : null,
    deletedById: d.deleted_by_id ?? null,
    createdAt: d.created_at ? new Date(d.created_at) : now,
    updatedAt: d.updated_at ? new Date(d.updated_at) : now,
  };
}
