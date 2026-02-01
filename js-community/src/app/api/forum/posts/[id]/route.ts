/**
 * Single Post API Route
 *
 * GET: Returns a single post
 * PATCH: Updates a post (edit content)
 * DELETE: Soft deletes a post
 */

import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { parseMarkdownAsync } from "@/lib/markdown";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const postResult = await db
      .select({
        id: schema.posts.id,
        topicId: schema.posts.topicId,
        postNumber: schema.posts.postNumber,
        raw: schema.posts.raw,
        cooked: schema.posts.cooked,
        replyToPostNumber: schema.posts.replyToPostNumber,
        replyCount: schema.posts.replyCount,
        likeCount: schema.posts.likeCount,
        hidden: schema.posts.hidden,
        wiki: schema.posts.wiki,
        version: schema.posts.version,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        authorId: schema.users.id,
        authorUsername: schema.users.username,
        authorName: schema.users.name,
      })
      .from(schema.posts)
      .innerJoin(schema.users, eq(schema.posts.userId, schema.users.id))
      .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postResult[0];

    return NextResponse.json({
      post: {
        id: post.id,
        topicId: post.topicId,
        postNumber: post.postNumber,
        raw: post.raw,
        cooked: post.cooked,
        replyToPostNumber: post.replyToPostNumber,
        replyCount: post.replyCount,
        likeCount: post.likeCount,
        hidden: post.hidden,
        wiki: post.wiki,
        version: post.version,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.authorId,
          username: post.authorUsername,
          name: post.authorName,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
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
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
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

    // Get the post
    const postResult = await db
      .select({
        id: schema.posts.id,
        userId: schema.posts.userId,
        raw: schema.posts.raw,
        version: schema.posts.version,
        wiki: schema.posts.wiki,
      })
      .from(schema.posts)
      .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postResult[0];
    const isOwner = post.userId === currentUser.id;
    const isAdmin = currentUser.admin;
    const isWiki = post.wiki;

    // Check permissions
    if (!isOwner && !isAdmin && !isWiki) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse new content
    const cooked = await parseMarkdownAsync(content);
    const now = new Date();
    const newVersion = post.version + 1;

    // Create revision record
    await db.insert(schema.postRevisions).values({
      postId,
      userId: currentUser.id,
      number: newVersion,
      modifications: JSON.stringify({
        raw: [post.raw, content.trim()],
      }),
      createdAt: now,
      updatedAt: now,
    });

    // Update the post
    await db
      .update(schema.posts)
      .set({
        raw: content.trim(),
        cooked,
        version: newVersion,
        lastVersionAt: now,
        updatedAt: now,
      })
      .where(eq(schema.posts.id, postId));

    return NextResponse.json({
      success: true,
      post: {
        id: postId,
        version: newVersion,
      },
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
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

    // Get the post
    const postResult = await db
      .select({
        id: schema.posts.id,
        userId: schema.posts.userId,
        postNumber: schema.posts.postNumber,
      })
      .from(schema.posts)
      .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postResult[0];
    const isOwner = post.userId === currentUser.id;
    const isAdmin = currentUser.admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Don't allow deleting the first post (use topic delete instead)
    if (post.postNumber === 1) {
      return NextResponse.json(
        { error: "Cannot delete the first post. Delete the topic instead." },
        { status: 400 },
      );
    }

    // Soft delete the post
    const now = new Date();
    await db
      .update(schema.posts)
      .set({
        deletedAt: now,
        deletedById: currentUser.id,
      })
      .where(eq(schema.posts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
