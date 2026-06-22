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
import {
  requireForumPermission,
  requireForumUser,
} from "@/lib/forum/forum-user";
import { notifyPostLiked } from "@/lib/forum/notifications";
import { createOrUpdateFlagReviewable } from "@/lib/forum/reviewables";
import { PERMISSIONS } from "@/lib/permissions/trust-levels";

const ACTION_TYPES = {
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

    const { id } = await params;
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const { action, reason, message } = body as {
      action: ActionType | "bookmark";
      reason?: string;
      message?: string;
    };

    if (action === "bookmark") {
      const userOrResponse = await requireForumUser(session);
      if (userOrResponse instanceof NextResponse) {
        return userOrResponse;
      }
      return handleBookmarkToggle(postId, userOrResponse.id);
    }

    if (!action || !ACTION_TYPES[action as ActionType]) {
      return NextResponse.json(
        { error: "Invalid action type. Must be: bookmark, like, or flag" },
        { status: 400 },
      );
    }

    const permission =
      action === "like" ? PERMISSIONS.LIKE_POSTS : PERMISSIONS.FLAG_POSTS;
    const userOrResponse = await requireForumPermission(session, permission);
    if (userOrResponse instanceof NextResponse) {
      return userOrResponse;
    }

    const userId = userOrResponse.id;

    const postResult = await db
      .select({
        id: schema.posts.id,
        userId: schema.posts.userId,
        topicId: schema.posts.topicId,
        topicTitle: schema.topics.title,
      })
      .from(schema.posts)
      .innerJoin(schema.topics, eq(schema.posts.topicId, schema.topics.id))
      .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postResult[0];

    if (action === "like" && post.userId === userId) {
      return NextResponse.json(
        { error: "You cannot like your own post" },
        { status: 400 },
      );
    }

    const actionTypeId = ACTION_TYPES[action as ActionType];
    const now = new Date();

    if (action === "flag") {
      const existingFlag = await db
        .select({ id: schema.postActions.id })
        .from(schema.postActions)
        .where(
          and(
            eq(schema.postActions.postId, postId),
            eq(schema.postActions.userId, userId),
            eq(schema.postActions.postActionTypeId, actionTypeId),
            isNull(schema.postActions.deletedAt),
          ),
        )
        .limit(1);

      if (existingFlag.length > 0) {
        return NextResponse.json({
          success: true,
          action: "flag",
          active: true,
        });
      }

      await db.insert(schema.postActions).values({
        postId,
        userId,
        postActionTypeId: actionTypeId,
        createdAt: now,
        updatedAt: now,
      });

      await createOrUpdateFlagReviewable({
        postId,
        topicId: post.topicId,
        flaggedById: userId,
        reason: reason || "other",
        message,
      });

      return NextResponse.json({
        success: true,
        action: "flag",
        active: true,
      });
    }

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

    if (existingAction.length > 0) {
      const isDeleted = existingAction[0].deletedAt !== null;

      await db
        .update(schema.postActions)
        .set({
          deletedAt: isDeleted ? null : now,
          updatedAt: now,
        })
        .where(eq(schema.postActions.id, existingAction[0].id));

      await db
        .update(schema.posts)
        .set({
          likeCount: isDeleted
            ? sql`${schema.posts.likeCount} + 1`
            : sql`GREATEST(${schema.posts.likeCount} - 1, 0)`,
        })
        .where(eq(schema.posts.id, postId));

      if (action === "like" && isDeleted) {
        await notifyPostLiked({
          postAuthorId: post.userId,
          actorId: userId,
          actorUsername: userOrResponse.username || "Unknown",
          topicId: post.topicId,
          postId,
          topicTitle: post.topicTitle,
        });
      }

      return NextResponse.json({
        success: true,
        action: "like",
        active: isDeleted,
      });
    }

    await db.insert(schema.postActions).values({
      postId,
      userId,
      postActionTypeId: actionTypeId,
      createdAt: now,
      updatedAt: now,
    });

    await db
      .update(schema.posts)
      .set({
        likeCount: sql`${schema.posts.likeCount} + 1`,
      })
      .where(eq(schema.posts.id, postId));

    await notifyPostLiked({
      postAuthorId: post.userId,
      actorId: userId,
      actorUsername: userOrResponse.username || "Unknown",
      topicId: post.topicId,
      postId,
      topicTitle: post.topicTitle,
    });

    return NextResponse.json({
      success: true,
      action: "like",
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

async function handleBookmarkToggle(
  postId: number,
  userId: number,
): Promise<NextResponse> {
  const postResult = await db
    .select({
      id: schema.posts.id,
      topicId: schema.posts.topicId,
    })
    .from(schema.posts)
    .where(and(eq(schema.posts.id, postId), isNull(schema.posts.deletedAt)))
    .limit(1);

  if (postResult.length === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const now = new Date();
  const existing = await db
    .select({
      id: schema.bookmarks.id,
      deletedAt: schema.bookmarks.deletedAt,
    })
    .from(schema.bookmarks)
    .where(
      and(
        eq(schema.bookmarks.userId, userId),
        eq(schema.bookmarks.postId, postId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    const isDeleted = existing[0].deletedAt !== null;

    await db
      .update(schema.bookmarks)
      .set({
        deletedAt: isDeleted ? null : now,
        updatedAt: now,
      })
      .where(eq(schema.bookmarks.id, existing[0].id));

    return NextResponse.json({
      success: true,
      action: "bookmark",
      active: isDeleted,
    });
  }

  await db.insert(schema.bookmarks).values({
    userId,
    postId,
    topicId: postResult[0].topicId,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({
    success: true,
    action: "bookmark",
    active: true,
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userOrResponse = await requireForumUser(session);
    if (userOrResponse instanceof NextResponse) {
      return userOrResponse;
    }

    const { id } = await params;
    const postId = Number.parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") as ActionType | "bookmark";

    if (action === "bookmark") {
      const now = new Date();
      await db
        .update(schema.bookmarks)
        .set({ deletedAt: now, updatedAt: now })
        .where(
          and(
            eq(schema.bookmarks.postId, postId),
            eq(schema.bookmarks.userId, userOrResponse.id),
            isNull(schema.bookmarks.deletedAt),
          ),
        );

      return NextResponse.json({
        success: true,
        action: "bookmark",
        active: false,
      });
    }

    if (!action || !ACTION_TYPES[action as ActionType]) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 },
      );
    }

    const userId = userOrResponse.id;
    const actionTypeId = ACTION_TYPES[action as ActionType];
    const now = new Date();

    await db
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
      action,
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
