/**
 * Single Topic API Route
 *
 * GET: Returns a single topic with metadata
 * PATCH: Updates topic (title, category, closed, pinned, etc.)
 * DELETE: Soft deletes a topic
 */

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import * as schema from "@/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const topicId = Number.parseInt(id);

    if (Number.isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    // Fetch topic with author and category
    const topicResult = await db
      .select({
        id: schema.topics.id,
        title: schema.topics.title,
        slug: schema.topics.slug,
        views: schema.topics.views,
        postsCount: schema.topics.postsCount,
        replyCount: schema.topics.replyCount,
        likeCount: schema.topics.likeCount,
        highestPostNumber: schema.topics.highestPostNumber,
        pinned: schema.topics.pinned,
        pinnedGlobally: schema.topics.pinnedGlobally,
        closed: schema.topics.closed,
        archived: schema.topics.archived,
        createdAt: schema.topics.createdAt,
        lastPostedAt: schema.topics.lastPostedAt,
        bumpedAt: schema.topics.bumpedAt,
        authorId: schema.users.id,
        authorUsername: schema.users.username,
        authorName: schema.users.name,
        categoryId: schema.categories.id,
        categoryName: schema.categories.name,
        categorySlug: schema.categories.slug,
        categoryColor: schema.categories.color,
      })
      .from(schema.topics)
      .innerJoin(schema.users, eq(schema.topics.userId, schema.users.id))
      .leftJoin(
        schema.categories,
        eq(schema.topics.categoryId, schema.categories.id)
      )
      .where(
        and(
          eq(schema.topics.id, topicId),
          eq(schema.topics.visible, true),
          isNull(schema.topics.deletedAt)
        )
      )
      .limit(1);

    if (topicResult.length === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const topic = topicResult[0];

    // Increment view count asynchronously
    db.update(schema.topics)
      .set({ views: sql`${schema.topics.views} + 1` })
      .where(eq(schema.topics.id, topicId))
      .execute()
      .catch(console.error);

    // Format response
    const formattedTopic = {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      views: topic.views,
      postsCount: topic.postsCount,
      replyCount: topic.replyCount,
      likeCount: topic.likeCount,
      highestPostNumber: topic.highestPostNumber,
      pinned: topic.pinned,
      pinnedGlobally: topic.pinnedGlobally,
      closed: topic.closed,
      archived: topic.archived,
      createdAt: topic.createdAt,
      lastPostedAt: topic.lastPostedAt,
      bumpedAt: topic.bumpedAt,
      author: {
        id: topic.authorId,
        username: topic.authorUsername,
        name: topic.authorName,
      },
      category: topic.categoryId
        ? {
            id: topic.categoryId,
            name: topic.categoryName,
            slug: topic.categorySlug,
            color: topic.categoryColor,
          }
        : null,
    };

    return NextResponse.json({ topic: formattedTopic });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const topicId = Number.parseInt(id);

    if (Number.isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, categoryId, closed, pinned, archived } = body;

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id, admin: schema.users.admin })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = userResult[0];

    // Check if user owns the topic or is admin
    const topicResult = await db
      .select({ userId: schema.topics.userId })
      .from(schema.topics)
      .where(eq(schema.topics.id, topicId))
      .limit(1);

    if (topicResult.length === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const isOwner = topicResult[0].userId === currentUser.id;
    const isAdmin = currentUser.admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updates: Partial<schema.Topic> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (isAdmin && closed !== undefined) {
      updates.closed = closed;
      updates.closedAt = closed ? new Date() : null;
    }
    if (isAdmin && pinned !== undefined) {
      updates.pinned = pinned;
      updates.pinnedAt = pinned ? new Date() : null;
    }
    if (isAdmin && archived !== undefined) {
      updates.archived = archived;
      updates.archivedAt = archived ? new Date() : null;
    }

    await db
      .update(schema.topics)
      .set(updates)
      .where(eq(schema.topics.id, topicId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const topicId = Number.parseInt(id);

    if (Number.isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id, admin: schema.users.admin })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = userResult[0];

    // Check if user owns the topic or is admin
    const topicResult = await db
      .select({ userId: schema.topics.userId })
      .from(schema.topics)
      .where(eq(schema.topics.id, topicId))
      .limit(1);

    if (topicResult.length === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const isOwner = topicResult[0].userId === currentUser.id;
    const isAdmin = currentUser.admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete the topic
    await db
      .update(schema.topics)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.topics.id, topicId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
