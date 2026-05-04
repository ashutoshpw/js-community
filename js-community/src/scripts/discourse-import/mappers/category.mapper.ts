/**
 * Discourse Import — Category mapper
 */

import type { NewCategory } from "@/db/schema";

export interface DiscourseCategory {
  id: number;
  name: string;
  slug?: string;
  color?: string;
  text_color?: string;
  description?: string | null;
  position?: number;
  parent_category_id?: number | null;
  read_restricted?: boolean;
  topic_count?: number;
  post_count?: number;
  created_at?: string;
  updated_at?: string;
}

export function mapCategory(
  d: DiscourseCategory,
  parentNewId?: number | null,
): Omit<NewCategory, "id"> {
  const now = new Date();
  return {
    name: d.name,
    slug: d.slug ?? slugify(d.name),
    color: (d.color ?? "0088CC").replace(/^#/, "").slice(0, 6),
    textColor: (d.text_color ?? "FFFFFF").replace(/^#/, "").slice(0, 6),
    description: d.description ?? null,
    position: d.position ?? 0,
    parentCategoryId: parentNewId ?? null,
    topicCount: d.topic_count ?? 0,
    postCount: d.post_count ?? 0,
    readRestricted: d.read_restricted ?? false,
    topicId: null,
    uploadedLogoId: null,
    uploadedBackgroundId: null,
    autoCloseHours: null,
    autoCloseBased: 3,
    allowBadges: true,
    topicFeaturedLinkAllowed: true,
    showSubcategoryList: false,
    numFeaturedTopics: 3,
    defaultView: "latest",
    subcategoryListStyle: "rows_with_featured_topics",
    defaultTopPeriod: "all",
    mailingListMode: false,
    minimumRequiredTags: 0,
    navigateToFirstPostAfterRead: false,
    sortOrder: null,
    sortAscending: null,
    createdAt: d.created_at ? new Date(d.created_at) : now,
    updatedAt: d.updated_at ? new Date(d.updated_at) : now,
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
