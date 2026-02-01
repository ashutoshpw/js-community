/**
 * User Activity API Route
 *
 * GET: Fetch user activity stream
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const offset = Number(searchParams.get("offset")) || 0;
    const filter = searchParams.get("filter") || "all";

    // Fetch user
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Build activity from posts and topics
    const activities: Array<{
      type: string;
      id: number;
      topicId: number;
      topicTitle: string;
      topicSlug: string | null;
      postNumber: number | null;
      excerpt: string;
      createdAt: string;
      categoryName: string | null;
      categoryColor: string | null;
    }> = [];

    // Fetch topics created by user
    if (filter === "all" || filter === "topics") {
      const topicsResult = await db
        .select({
          id: schema.topics.id,
          title: schema.topics.title,
          slug: schema.topics.slug,
          createdAt: schema.topics.createdAt,
          categoryName: schema.categories.name,
          categoryColor: schema.categories.color,
        })
        .from(schema.topics)
        .leftJoin(
          schema.categories,
          eq(schema.topics.categoryId, schema.categories.id),
        )
        .where(
          and(
            eq(schema.topics.userId, userId),
            isNull(schema.topics.deletedAt),
          ),
        )
        .orderBy(desc(schema.topics.createdAt))
        .limit(limit);

      // Get first post for each topic
      for (const topic of topicsResult) {
        const firstPost = await db
          .select({ raw: schema.posts.raw })
          .from(schema.posts)
          .where(
            and(
              eq(schema.posts.topicId, topic.id),
              eq(schema.posts.postNumber, 1),
            ),
          )
          .limit(1);

        activities.push({
          type: "topic",
          id: topic.id,
          topicId: topic.id,
          topicTitle: topic.title,
          topicSlug: topic.slug,
          postNumber: 1,
          excerpt:
            `${firstPost[0]?.raw?.slice(0, 150).replace(/\n/g, " ")}...` || "",
          createdAt: topic.createdAt.toISOString(),
          categoryName: topic.categoryName,
          categoryColor: topic.categoryColor,
        });
      }
    }

    // Fetch replies by user (posts with postNumber > 1)
    if (filter === "all" || filter === "replies") {
      const postsResult = await db
        .select({
          id: schema.posts.id,
          topicId: schema.posts.topicId,
          postNumber: schema.posts.postNumber,
          raw: schema.posts.raw,
          createdAt: schema.posts.createdAt,
          topicTitle: schema.topics.title,
          topicSlug: schema.topics.slug,
          categoryName: schema.categories.name,
          categoryColor: schema.categories.color,
        })
        .from(schema.posts)
        .innerJoin(schema.topics, eq(schema.posts.topicId, schema.topics.id))
        .leftJoin(
          schema.categories,
          eq(schema.topics.categoryId, schema.categories.id),
        )
        .where(
          and(
            eq(schema.posts.userId, userId),
            isNull(schema.posts.deletedAt),
            // Only get replies (postNumber > 1) if filtering by replies
            // For "all", include all posts
          ),
        )
        .orderBy(desc(schema.posts.createdAt))
        .limit(limit);

      for (const post of postsResult) {
        // Skip first posts if we already have them as topics
        if (filter === "all" && post.postNumber === 1) continue;

        activities.push({
          type: post.postNumber === 1 ? "topic" : "reply",
          id: post.id,
          topicId: post.topicId,
          topicTitle: post.topicTitle,
          topicSlug: post.topicSlug,
          postNumber: post.postNumber,
          excerpt: `${post.raw?.slice(0, 150).replace(/\n/g, " ")}...` || "",
          createdAt: post.createdAt.toISOString(),
          categoryName: post.categoryName,
          categoryColor: post.categoryColor,
        });
      }
    }

    // Fetch likes given by user
    if (filter === "all" || filter === "likes") {
      const likesResult = await db
        .select({
          id: schema.postActions.id,
          postId: schema.postActions.postId,
          createdAt: schema.postActions.createdAt,
          postRaw: schema.posts.raw,
          postNumber: schema.posts.postNumber,
          topicId: schema.topics.id,
          topicTitle: schema.topics.title,
          topicSlug: schema.topics.slug,
          categoryName: schema.categories.name,
          categoryColor: schema.categories.color,
        })
        .from(schema.postActions)
        .innerJoin(schema.posts, eq(schema.postActions.postId, schema.posts.id))
        .innerJoin(schema.topics, eq(schema.posts.topicId, schema.topics.id))
        .leftJoin(
          schema.categories,
          eq(schema.topics.categoryId, schema.categories.id),
        )
        .where(
          and(
            eq(schema.postActions.userId, userId),
            eq(schema.postActions.postActionTypeId, 2), // Like action type
            isNull(schema.postActions.deletedAt),
          ),
        )
        .orderBy(desc(schema.postActions.createdAt))
        .limit(limit);

      for (const like of likesResult) {
        activities.push({
          type: "like",
          id: like.id,
          topicId: like.topicId,
          topicTitle: like.topicTitle,
          topicSlug: like.topicSlug,
          postNumber: like.postNumber,
          excerpt:
            `${like.postRaw?.slice(0, 150).replace(/\n/g, " ")}...` || "",
          createdAt: like.createdAt.toISOString(),
          categoryName: like.categoryName,
          categoryColor: like.categoryColor,
        });
      }
    }

    // Sort all activities by date
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Apply pagination
    const paginatedActivities = activities.slice(offset, offset + limit);

    return NextResponse.json({
      activities: paginatedActivities,
      hasMore: activities.length > offset + limit,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 },
    );
  }
}
