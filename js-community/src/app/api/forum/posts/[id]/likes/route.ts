/**
 * Post Likes API Route
 *
 * GET: Fetch users who liked a post
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

// Like action type ID (following Discourse convention)
const LIKE_ACTION_TYPE_ID = 2;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const offset = Number(searchParams.get("offset")) || 0;

    // Fetch users who liked this post
    const likesResult = await db
      .select({
        id: schema.postActions.id,
        createdAt: schema.postActions.createdAt,
        userId: schema.users.id,
        username: schema.users.username,
        name: schema.users.name,
        avatarUrl: schema.userProfiles.avatarUrl,
      })
      .from(schema.postActions)
      .innerJoin(schema.users, eq(schema.postActions.userId, schema.users.id))
      .leftJoin(
        schema.userProfiles,
        eq(schema.users.id, schema.userProfiles.userId),
      )
      .where(
        and(
          eq(schema.postActions.postId, postId),
          eq(schema.postActions.postActionTypeId, LIKE_ACTION_TYPE_ID),
          isNull(schema.postActions.deletedAt),
        ),
      )
      .orderBy(desc(schema.postActions.createdAt))
      .limit(limit)
      .offset(offset);

    const users = likesResult.map((like) => ({
      id: like.userId,
      username: like.username,
      name: like.name,
      avatarUrl: like.avatarUrl,
      likedAt: like.createdAt.toISOString(),
    }));

    // Get total count
    const countResult = await db
      .select({ id: schema.postActions.id })
      .from(schema.postActions)
      .where(
        and(
          eq(schema.postActions.postId, postId),
          eq(schema.postActions.postActionTypeId, LIKE_ACTION_TYPE_ID),
          isNull(schema.postActions.deletedAt),
        ),
      );

    return NextResponse.json({
      users,
      total: countResult.length,
      hasMore: likesResult.length === limit,
    });
  } catch (error) {
    console.error("Error fetching post likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 },
    );
  }
}
