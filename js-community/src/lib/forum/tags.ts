/**
 * Tag helpers for attaching tags to topics.
 */

import { and, eq, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

function normalizeTagName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 100);
}

export async function attachTagsToTopic(
  topicId: number,
  tagNames: string[] | undefined,
  canCreateTags: boolean,
): Promise<void> {
  if (!tagNames?.length) {
    return;
  }

  const uniqueNames = [
    ...new Set(tagNames.map(normalizeTagName).filter(Boolean)),
  ];

  for (const name of uniqueNames) {
    let tagId: number;

    const existing = await db
      .select({ id: schema.tags.id })
      .from(schema.tags)
      .where(eq(schema.tags.name, name))
      .limit(1);

    if (existing.length > 0) {
      tagId = existing[0].id;
    } else if (canCreateTags) {
      const [created] = await db
        .insert(schema.tags)
        .values({
          name,
          topicCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: schema.tags.id });
      tagId = created.id;
    } else {
      continue;
    }

    const linkExists = await db
      .select({ id: schema.topicTags.id })
      .from(schema.topicTags)
      .where(
        and(
          eq(schema.topicTags.topicId, topicId),
          eq(schema.topicTags.tagId, tagId),
        ),
      )
      .limit(1);

    if (linkExists.length > 0) {
      continue;
    }

    await db.insert(schema.topicTags).values({
      topicId,
      tagId,
      createdAt: new Date(),
    });

    await db
      .update(schema.tags)
      .set({
        topicCount: sql`${schema.tags.topicCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.tags.id, tagId));
  }
}
