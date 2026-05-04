/**
 * RSS 2.0 Feed
 *
 * GET /api/forum/rss
 *
 * Returns an RSS 2.0 XML feed of the 20 most recent visible topics,
 * with the first post as each item's description.
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import { getAppBaseUrl } from "@/lib/site-url";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_request: NextRequest) {
  const baseUrl = await getAppBaseUrl();

  let items = "";

  try {
    const topicRows = await db
      .select({
        id: schema.topics.id,
        title: schema.topics.title,
        slug: schema.topics.slug,
        createdAt: schema.topics.createdAt,
        username: schema.users.username,
        categoryName: schema.categories.name,
      })
      .from(schema.topics)
      .leftJoin(schema.users, eq(schema.topics.userId, schema.users.id))
      .leftJoin(
        schema.categories,
        eq(schema.topics.categoryId, schema.categories.id),
      )
      .where(
        and(eq(schema.topics.visible, true), isNull(schema.topics.deletedAt)),
      )
      .orderBy(desc(schema.topics.createdAt))
      .limit(20);

    for (const topic of topicRows) {
      // Fetch first post for description
      const firstPost = await db
        .select({ raw: schema.posts.raw })
        .from(schema.posts)
        .where(
          and(
            eq(schema.posts.topicId, topic.id),
            eq(schema.posts.postNumber, 1),
            isNull(schema.posts.deletedAt),
          ),
        )
        .limit(1);

      const description = firstPost[0]?.raw
        ? firstPost[0].raw.slice(0, 400).replace(/\n/g, " ") +
          (firstPost[0].raw.length > 400 ? "..." : "")
        : "";

      const topicUrl = `${baseUrl}/forum/t/${topic.id}/${topic.slug}`;

      items += `
    <item>
      <title>${escapeXml(topic.title)}</title>
      <link>${topicUrl}</link>
      <guid isPermaLink="true">${topicUrl}</guid>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(topic.username ?? "unknown")}</author>
      ${topic.categoryName ? `<category>${escapeXml(topic.categoryName)}</category>` : ""}
      <pubDate>${topic.createdAt.toUTCString()}</pubDate>
    </item>`;
    }
  } catch {
    // Return empty feed on DB error
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JS Community — Latest Topics</title>
    <link>${baseUrl}/forum</link>
    <description>The latest discussions from JS Community, a forum for JavaScript developers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/forum/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
