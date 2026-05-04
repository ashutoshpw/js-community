/**
 * Dynamic XML Sitemap
 *
 * Generates a sitemap covering:
 * - Static marketing and forum pages
 * - All visible, non-deleted topics from the database
 */

import type { MetadataRoute } from "next";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/database";
import { topics } from "@/db/schema";
import { getAppBaseUrl } from "@/lib/site-url";

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/docs", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/forum", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/guidelines", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getAppBaseUrl();

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Dynamic topic pages — fetch up to 5000 most recent visible topics
  let topicEntries: MetadataRoute.Sitemap = [];
  try {
    const topicRows = await db
      .select({
        id: topics.id,
        slug: topics.slug,
        updatedAt: topics.updatedAt,
      })
      .from(topics)
      .where(and(eq(topics.visible, true), isNull(topics.deletedAt)))
      .orderBy(desc(topics.updatedAt))
      .limit(5000);

    topicEntries = topicRows.map((topic) => ({
      url: `${baseUrl}/forum/t/${topic.id}/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB may not be available at build time — gracefully return only static entries
  }

  return [...staticEntries, ...topicEntries];
}
