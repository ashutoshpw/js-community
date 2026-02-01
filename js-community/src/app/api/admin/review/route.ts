/**
 * Admin Review Queue API Route
 *
 * GET: List reviewable items
 */

import { count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
    const status = searchParams.get("status") || "pending";

    const offset = (page - 1) * limit;

    // Build query
    const whereClause =
      status === "pending"
        ? eq(schema.reviewables.status, "pending")
        : undefined;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.reviewables)
      .where(whereClause);

    // Get reviewables
    const reviewables = await db
      .select()
      .from(schema.reviewables)
      .where(whereClause)
      .orderBy(
        desc(schema.reviewables.score),
        desc(schema.reviewables.createdAt),
      )
      .limit(limit)
      .offset(offset);

    // Enrich with target data
    const enrichedItems = await Promise.all(
      reviewables.map(async (item) => {
        let target: { title?: string; content?: string; username?: string } =
          {};
        let createdBy: { id: number; name: string } | null = null;

        // Get creator info
        if (item.createdById) {
          const [user] = await db
            .select({ id: schema.users.id, name: schema.users.name })
            .from(schema.users)
            .where(eq(schema.users.id, item.createdById))
            .limit(1);
          if (user) {
            createdBy = { id: user.id, name: user.name || "Unknown" };
          }
        }

        // Get target info based on type
        if (item.targetType === "post") {
          const [post] = await db
            .select({ raw: schema.posts.raw })
            .from(schema.posts)
            .where(eq(schema.posts.id, item.targetId))
            .limit(1);
          if (post) {
            target = { content: post.raw?.substring(0, 200) };
          }
        } else if (item.targetType === "topic") {
          const [topic] = await db
            .select({ title: schema.topics.title })
            .from(schema.topics)
            .where(eq(schema.topics.id, item.targetId))
            .limit(1);
          if (topic) {
            target = { title: topic.title };
          }
        } else if (item.targetType === "user") {
          const [user] = await db
            .select({ name: schema.users.name })
            .from(schema.users)
            .where(eq(schema.users.id, item.targetId))
            .limit(1);
          if (user) {
            target = { username: user.name || "Unknown" };
          }
        }

        // Get score count and top reason
        const scores = await db
          .select()
          .from(schema.reviewableScores)
          .where(eq(schema.reviewableScores.reviewableId, item.id));

        const scoreCount = scores.length;
        const topReason =
          scores.length > 0 ? scores[0].reviewableScoreType : null;

        return {
          id: item.id,
          type: item.type,
          status: item.status,
          targetId: item.targetId,
          targetType: item.targetType,
          score: item.score || 0,
          potentialSpam: item.potentialSpam || false,
          createdAt: item.createdAt.toISOString(),
          createdBy,
          target,
          scoreCount,
          topReason,
        };
      }),
    );

    return NextResponse.json({
      items: enrichedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching review items:", error);
    return NextResponse.json(
      { error: "Failed to fetch review items" },
      { status: 500 },
    );
  }
}
