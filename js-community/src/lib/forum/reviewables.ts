/**
 * Review queue helpers — flags create reviewable items for moderators.
 */

import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

const FLAG_SCORES: Record<string, number> = {
  spam: 5,
  inappropriate: 4,
  off_topic: 3,
  illegal: 5,
  other: 2,
};

export async function createOrUpdateFlagReviewable(options: {
  postId: number;
  topicId: number;
  flaggedById: number;
  reason: string;
  message?: string;
}): Promise<void> {
  const scoreType = options.reason in FLAG_SCORES ? options.reason : "other";
  const scoreValue = FLAG_SCORES[scoreType] ?? 2;
  const now = new Date();

  const existing = await db
    .select({ id: schema.reviewables.id, score: schema.reviewables.score })
    .from(schema.reviewables)
    .where(
      and(
        eq(schema.reviewables.targetType, "post"),
        eq(schema.reviewables.targetId, options.postId),
        eq(schema.reviewables.status, "pending"),
      ),
    )
    .limit(1);

  let reviewableId: number;

  if (existing.length > 0) {
    reviewableId = existing[0].id;
    await db
      .update(schema.reviewables)
      .set({
        score: (existing[0].score ?? 0) + scoreValue,
        updatedAt: now,
      })
      .where(eq(schema.reviewables.id, reviewableId));
  } else {
    const [created] = await db
      .insert(schema.reviewables)
      .values({
        type: "ReviewableFlaggedPost",
        status: "pending",
        targetId: options.postId,
        targetType: "post",
        createdById: options.flaggedById,
        score: scoreValue,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.reviewables.id });

    reviewableId = created.id;
  }

  await db.insert(schema.reviewableScores).values({
    reviewableId,
    userId: options.flaggedById,
    reviewableScoreType: scoreType,
    score: scoreValue,
    reason: options.message ?? options.reason,
    meta: JSON.stringify({ topicId: options.topicId }),
    createdAt: now,
  });
}
