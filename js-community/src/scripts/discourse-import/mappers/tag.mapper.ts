/**
 * Discourse Import — Tag mapper
 */

import type { NewTag, NewTopicTag } from "@/db/schema";

export interface DiscourseTag {
  id: number;
  name: string;
  topic_count?: number;
  pm_topic_count?: number;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DiscourseTopicTag {
  topic_id: number;
  tag_id: number;
}

export function mapTag(d: DiscourseTag): Omit<NewTag, "id"> {
  const now = new Date();
  return {
    name: d.name,
    topicCount: d.topic_count ?? 0,
    pmTopicCount: d.pm_topic_count ?? 0,
    targetTagId: null,
    description: d.description ?? null,
    createdAt: d.created_at ? new Date(d.created_at) : now,
    updatedAt: d.updated_at ? new Date(d.updated_at) : now,
  };
}

export function mapTopicTag(
  newTopicId: number,
  newTagId: number,
): Omit<NewTopicTag, "id"> {
  const now = new Date();
  return {
    topicId: newTopicId,
    tagId: newTagId,
    createdAt: now,
    updatedAt: now,
  };
}
