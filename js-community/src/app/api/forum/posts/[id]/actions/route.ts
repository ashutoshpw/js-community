/**
 * Post Actions API Route
 *
 * POST: Toggle like, bookmark, or flag on a post
 * DELETE: Remove an action from a post
 */

import { and, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";

// Action types (following Discourse convention)
const ACTION_TYPES = {
  bookmark: 1,
  like: 2,
  flag: 3,
} as const;

type ActionType = keyof typeof ACTION_TYPES;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const { action } = body as { action: ActionType };

    if (!action || !ACTION_TYPES[action]) {
      return NextResponse.json(
        { error: "Invalid action type. Must be: bookmark, like, or flag" },
        { status: 400 },
      );
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
    const actionTypeId = ACTION_TYPES[action];

    // Check post exists
    const postResult = await db
      .select({ id: schema.posts.id, userId: schema.posts.userId })
      .from(schema.posts)
      .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Prevent self-liking
    if (action === "like" && postResult[0].userId === userId) {
      return NextResponse.json(
        { error: "You cannot like your own post" },
        { status: 400 },
      );
    }

    // Check if action already exists
    const existingAction = await db
      .select({
        id: schema.postActions.id,
        deletedAt: schema.postActions.deletedAt,
      })
      .from(schema.postActions)
      .where(
        and(
          eq(schema.postActions.postId, postId),
          eq(schema.postActions.userId, userId),
          eq(schema.postActions.postActionTypeId, actionTypeId),
        ),
      )
      .limit(1);

    const now = new Date();

    if (existingAction.length > 0) {
      // Toggle: if soft-deleted, restore it; if active, soft-delete it
      const isDeleted = existingAction[0].deletedAt !== null;

      await db
        .update(schema.postActions)
        .set({
          deletedAt: isDeleted ? null : now,
          updatedAt: now,
        })
        .where(eq(schema.postActions.id, existingAction[0].id));

      // Update like count on post
      if (action === "like") {
        await db
          .update(schema.posts)
          .set({
            likeCount: isDeleted
              ? sql`${schema.posts.likeCount} + 1`
              : sql`GREATEST(${schema.posts.likeCount} - 1, 0)`,
          })
          .where(eq(schema.posts.id, postId));
      }

      return NextResponse.json({
        success: true,
        action: action,
        active: isDeleted, // If was deleted, now it's active
      });
    }

    // Create new action
    await db.insert(schema.postActions).values({
      postId,
      userId,
      postActionTypeId: actionTypeId,
      createdAt: now,
      updatedAt: now,
    });

    // Update like count on post
    if (action === "like") {
      await db
        .update(schema.posts)
        .set({
          likeCount: sql`${schema.posts.likeCount} + 1`,
        })
        .where(eq(schema.posts.id, postId));
    }

    return NextResponse.json({
      success: true,
      action: action,
      active: true,
    });
  } catch (error) {
    console.error("Error performing post action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 },
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
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") as ActionType;

    if (!action || !ACTION_TYPES[action]) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 },
      );
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
    const actionTypeId = ACTION_TYPES[action];
    const now = new Date();

    // Soft delete the action
    const _result = await db
      .update(schema.postActions)
      .set({
        deletedAt: now,
        deletedById: userId,
        updatedAt: now,
      })
      .where(
        and(
          eq(schema.postActions.postId, postId),
          eq(schema.postActions.userId, userId),
          eq(schema.postActions.postActionTypeId, actionTypeId),
          isNull(schema.postActions.deletedAt),
        ),
      );

    // Update like count if removing a like
    if (action === "like") {
      await db
        .update(schema.posts)
        .set({
          likeCount: sql`GREATEST(${schema.posts.likeCount} - 1, 0)`,
        })
        .where(eq(schema.posts.id, postId));
    }

    return NextResponse.json({
      success: true,
      action: action,
      active: false,
    });
  } catch (error) {
    console.error("Error removing post action:", error);
    return NextResponse.json(
      { error: "Failed to remove action" },
      { status: 500 },
    );
  }
}
