/**
 * Bookmarks API Route
 *
 * GET: Fetch user bookmarks
 * POST: Create a bookmark
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    // Fetch bookmarks with post/topic details
    const bookmarksResult = await db
      .select({
        id: schema.bookmarks.id,
        name: schema.bookmarks.name,
        pinned: schema.bookmarks.pinned,
        reminderAt: schema.bookmarks.reminderAt,
        createdAt: schema.bookmarks.createdAt,
        postId: schema.bookmarks.postId,
        topicId: schema.bookmarks.topicId,
        postRaw: schema.posts.raw,
        postNumber: schema.posts.postNumber,
        topicTitle: schema.topics.title,
        topicSlug: schema.topics.slug,
        postUserId: schema.posts.userId,
        postUsername: schema.users.username,
        categoryId: schema.topics.categoryId,
        categoryName: schema.categories.name,
        categoryColor: schema.categories.color,
      })
      .from(schema.bookmarks)
      .leftJoin(schema.posts, eq(schema.bookmarks.postId, schema.posts.id))
      .leftJoin(schema.topics, eq(schema.posts.topicId, schema.topics.id))
      .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
      .leftJoin(
        schema.categories,
        eq(schema.topics.categoryId, schema.categories.id),
      )
      .where(
        and(
          eq(schema.bookmarks.userId, userId),
          isNull(schema.bookmarks.deletedAt),
        ),
      )
      .orderBy(desc(schema.bookmarks.pinned), desc(schema.bookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    const bookmarks = bookmarksResult.map((b) => ({
      id: b.id,
      name: b.name,
      pinned: b.pinned,
      reminderAt: b.reminderAt,
      createdAt: b.createdAt,
      post: b.postId
        ? {
            id: b.postId,
            postNumber: b.postNumber,
            excerpt: b.postRaw?.slice(0, 200).replace(/\n/g, " ") || "",
            username: b.postUsername,
          }
        : null,
      topic: b.topicId
        ? {
            id: b.topicId,
            title: b.topicTitle,
            slug: b.topicSlug,
          }
        : null,
      category: b.categoryId
        ? {
            id: b.categoryId,
            name: b.categoryName,
            color: b.categoryColor,
          }
        : null,
    }));

    return NextResponse.json({
      bookmarks,
      hasMore: bookmarksResult.length === limit,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;
    const body = await request.json();
    const { postId, topicId, name, reminderAt, pinned } = body as {
      postId?: number;
      topicId?: number;
      name?: string;
      reminderAt?: string;
      pinned?: boolean;
    };

    if (!postId && !topicId) {
      return NextResponse.json(
        { error: "Either postId or topicId is required" },
        { status: 400 },
      );
    }

    const now = new Date();

    // Check if bookmark already exists
    const conditions = [
      eq(schema.bookmarks.userId, userId),
      isNull(schema.bookmarks.deletedAt),
    ];
    if (postId) {
      conditions.push(eq(schema.bookmarks.postId, postId));
    }
    if (topicId) {
      conditions.push(eq(schema.bookmarks.topicId, topicId));
    }

    const existingBookmark = await db
      .select({ id: schema.bookmarks.id })
      .from(schema.bookmarks)
      .where(and(...conditions))
      .limit(1);

    if (existingBookmark.length > 0) {
      // Update existing bookmark
      await db
        .update(schema.bookmarks)
        .set({
          name: name || null,
          reminderAt: reminderAt ? new Date(reminderAt) : null,
          reminderSetAt: reminderAt ? now : null,
          pinned: pinned ?? false,
          updatedAt: now,
        })
        .where(eq(schema.bookmarks.id, existingBookmark[0].id));

      return NextResponse.json({
        success: true,
        bookmarkId: existingBookmark[0].id,
        updated: true,
      });
    }

    // Get topicId from post if not provided
    let finalTopicId = topicId;
    if (postId && !topicId) {
      const postResult = await db
        .select({ topicId: schema.posts.topicId })
        .from(schema.posts)
        .where(eq(schema.posts.id, postId))
        .limit(1);

      if (postResult.length > 0) {
        finalTopicId = postResult[0].topicId;
      }
    }

    // Create new bookmark
    const result = await db
      .insert(schema.bookmarks)
      .values({
        userId,
        postId: postId || null,
        topicId: finalTopicId || null,
        name: name || null,
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        reminderSetAt: reminderAt ? now : null,
        pinned: pinned ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.bookmarks.id });

    return NextResponse.json({
      success: true,
      bookmarkId: result[0].id,
      created: true,
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
