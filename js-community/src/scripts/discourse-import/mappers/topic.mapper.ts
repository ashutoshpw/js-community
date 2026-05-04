/**
 * Discourse Import — Topic mapper
 */

import type { NewTopic } from "@/db/schema";

export interface DiscourseTopic {
  id: number;
  title: string;
  slug?: string;
  user_id: number;
  category_id?: number | null;
  views?: number;
  posts_count?: number;
  reply_count?: number;
  like_count?: number;
  highest_post_number?: number;
  last_posted_at?: string | null;
  bumped_at?: string | null;
  pinned?: boolean;
  pinned_at?: string | null;
  pinned_globally?: boolean;
  pinned_until?: string | null;
  visible?: boolean;
  closed?: boolean;
  closed_at?: string | null;
  archived?: boolean;
  archived_at?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function mapTopic(
  d: DiscourseTopic,
  newUserId: number,
  newCategoryId: number | null,
  slugSuffix: string,
): NewTopic {
  const now = new Date();
  // Ensure slug is unique by appending the original Discourse ID
  const slug = `${d.slug ?? slugify(d.title)}-${slugSuffix}`;
  return {
    title: d.title,
    slug,
    userId: newUserId,
    categoryId: newCategoryId,
    views: d.views ?? 0,
    postsCount: d.posts_count ?? 0,
    replyCount: d.reply_count ?? 0,
    likeCount: d.like_count ?? 0,
    highestPostNumber: d.highest_post_number ?? 0,
    lastPostedAt: d.last_posted_at ? new Date(d.last_posted_at) : null,
    lastReplyAt: null,
    bumpedAt: d.bumped_at ? new Date(d.bumped_at) : null,
    pinned: d.pinned ?? false,
    pinnedAt: d.pinned_at ? new Date(d.pinned_at) : null,
    pinnedGlobally: d.pinned_globally ?? false,
    pinnedUntil: d.pinned_until ? new Date(d.pinned_until) : null,
    visible: d.visible ?? true,
    closed: d.closed ?? false,
    closedAt: d.closed_at ? new Date(d.closed_at) : null,
    archived: d.archived ?? false,
    archivedAt: d.archived_at ? new Date(d.archived_at) : null,
    deletedAt: d.deleted_at ? new Date(d.deleted_at) : null,
    createdAt: d.created_at ? new Date(d.created_at) : now,
    updatedAt: d.updated_at ? new Date(d.updated_at) : now,
  };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
