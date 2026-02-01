/**
 * Posts API Route for a Topic
 *
 * GET: Returns paginated posts for a topic
 * POST: Creates a new reply in the topic
 */

import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { parseMarkdownAsync } from "@/lib/markdown";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const topicId = Number.parseInt(id, 10);

    if (Number.isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10),
    );
    const perPage = Math.min(
      50,
      Math.max(1, Number.parseInt(searchParams.get("per_page") || "20", 10)),
    );
    const offset = (page - 1) * perPage;

    // Check topic exists and is visible
    const topicCheck = await db
      .select({ id: schema.topics.id })
      .from(schema.topics)
      .where(
        and(
          eq(schema.topics.id, topicId),
          eq(schema.topics.visible, true),
          isNull(schema.topics.deletedAt),
        ),
      )
      .limit(1);

    if (topicCheck.length === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Get current user for like/bookmark status
    let currentUserId: number | null = null;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.email) {
        const userResult = await db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(eq(schema.users.email, session.user.email))
          .limit(1);
        if (userResult.length > 0) {
          currentUserId = userResult[0].id;
        }
      }
    } catch {
      // Not logged in, continue without user context
    }

    // Fetch posts with authors and user profiles
    const posts = await db
      .select({
        id: schema.posts.id,
        postNumber: schema.posts.postNumber,
        raw: schema.posts.raw,
        cooked: schema.posts.cooked,
        replyToPostNumber: schema.posts.replyToPostNumber,
        replyCount: schema.posts.replyCount,
        likeCount: schema.posts.likeCount,
        reads: schema.posts.reads,
        hidden: schema.posts.hidden,
        wiki: schema.posts.wiki,
        version: schema.posts.version,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        authorId: schema.users.id,
        authorUsername: schema.users.username,
        authorName: schema.users.name,
        authorAdmin: schema.users.admin,
        authorModerator: schema.users.moderator,
        authorTrustLevel: schema.users.trustLevel,
        avatarUrl: schema.userProfiles.avatarUrl,
      })
      .from(schema.posts)
      .innerJoin(schema.users, eq(schema.posts.userId, schema.users.id))
      .leftJoin(
        schema.userProfiles,
        eq(schema.users.id, schema.userProfiles.userId),
      )
      .where(
        and(eq(schema.posts.topicId, topicId), isNull(schema.posts.deletedAt)),
      )
      .orderBy(asc(schema.posts.postNumber))
      .limit(perPage)
      .offset(offset);

    // Get user actions (likes, bookmarks) for current user
    const userActions: Map<number, { liked: boolean; bookmarked: boolean }> =
      new Map();
    if (currentUserId && posts.length > 0) {
      const postIds = posts.map((p) => p.id);
      const actions = await db
        .select({
          postId: schema.postActions.postId,
          actionType: schema.postActions.postActionTypeId,
        })
        .from(schema.postActions)
        .where(
          and(
            eq(schema.postActions.userId, currentUserId),
            isNull(schema.postActions.deletedAt),
          ),
        );

      for (const action of actions) {
        if (!postIds.includes(action.postId)) continue;
        const existing = userActions.get(action.postId) || {
          liked: false,
          bookmarked: false,
        };
        // Action type 2 = like, 1 = bookmark (Discourse convention)
        if (action.actionType === 2) existing.liked = true;
        if (action.actionType === 1) existing.bookmarked = true;
        userActions.set(action.postId, existing);
      }
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.posts)
      .where(
        and(eq(schema.posts.topicId, topicId), isNull(schema.posts.deletedAt)),
      );

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / perPage);

    // Format posts
    const formattedPosts = posts.map((post) => {
      const actions = userActions.get(post.id) || {
        liked: false,
        bookmarked: false,
      };
      return {
        id: post.id,
        postNumber: post.postNumber,
        raw: post.raw,
        cooked: post.cooked,
        replyToPostNumber: post.replyToPostNumber,
        replyCount: post.replyCount,
        likeCount: post.likeCount,
        reads: post.reads,
        hidden: post.hidden,
        wiki: post.wiki,
        version: post.version,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.authorId,
          username: post.authorUsername,
          name: post.authorName,
          admin: post.authorAdmin,
          moderator: post.authorModerator,
          trustLevel: post.authorTrustLevel,
          avatarUrl: post.avatarUrl,
        },
        currentUserActions: {
          liked: actions.liked,
          bookmarked: actions.bookmarked,
        },
      };
    });

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
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
    const topicId = Number.parseInt(id, 10);

    if (Number.isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    // Check topic exists and is open
    const topicResult = await db
      .select({
        id: schema.topics.id,
        closed: schema.topics.closed,
        highestPostNumber: schema.topics.highestPostNumber,
      })
      .from(schema.topics)
      .where(
        and(
          eq(schema.topics.id, topicId),
          eq(schema.topics.visible, true),
          isNull(schema.topics.deletedAt),
        ),
      )
      .limit(1);

    if (topicResult.length === 0) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topicResult[0].closed) {
      return NextResponse.json(
        { error: "Topic is closed for replies" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { content, replyToPostNumber } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    // Get user ID
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;
    const now = new Date();
    const newPostNumber = topicResult[0].highestPostNumber + 1;

    // Parse markdown
    const cooked = await parseMarkdownAsync(content);

    // Create post
    const postResult = await db
      .insert(schema.posts)
      .values({
        topicId,
        userId,
        postNumber: newPostNumber,
        raw: content.trim(),
        cooked,
        replyToPostNumber: replyToPostNumber || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.posts.id, postNumber: schema.posts.postNumber });

    // Update topic stats
    await db
      .update(schema.topics)
      .set({
        highestPostNumber: newPostNumber,
        postsCount: sql`${schema.topics.postsCount} + 1`,
        replyCount: sql`${schema.topics.replyCount} + 1`,
        lastPostedAt: now,
        bumpedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.topics.id, topicId));

    // Update reply count on parent post if this is a reply
    if (replyToPostNumber) {
      await db
        .update(schema.posts)
        .set({
          replyCount: sql`${schema.posts.replyCount} + 1`,
        })
        .where(
          and(
            eq(schema.posts.topicId, topicId),
            eq(schema.posts.postNumber, replyToPostNumber),
          ),
        );
    }

    return NextResponse.json({
      post: {
        id: postResult[0].id,
        postNumber: postResult[0].postNumber,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
