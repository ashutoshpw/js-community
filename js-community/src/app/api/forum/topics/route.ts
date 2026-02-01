/**
 * Topics API Route
 *
 * GET: Returns paginated topics with filters
 * POST: Creates a new topic (requires authentication)
 */

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import * as schema from "@/db/schema";
import { eq, desc, asc, and, sql, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parseMarkdownAsync } from "@/lib/markdown";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(
      50,
      Math.max(1, Number.parseInt(searchParams.get("per_page") || "20"))
    );
    const sort = searchParams.get("sort") || "latest";
    const categorySlug = searchParams.get("category");

    const offset = (page - 1) * perPage;

    // Build where conditions
    const conditions = [
      eq(schema.topics.visible, true),
      isNull(schema.topics.deletedAt),
    ];

    // Add category filter if specified
    let categoryId: number | null = null;
    if (categorySlug) {
      const category = await db
        .select({ id: schema.categories.id })
        .from(schema.categories)
        .where(eq(schema.categories.slug, categorySlug))
        .limit(1);

      if (category.length > 0) {
        categoryId = category[0].id;
        conditions.push(eq(schema.topics.categoryId, categoryId));
      }
    }

    // Determine sort order
    let orderBy: ReturnType<typeof desc>;
    switch (sort) {
      case "top":
        orderBy = desc(schema.topics.likeCount);
        break;
      case "new":
        orderBy = desc(schema.topics.createdAt);
        break;
      case "latest":
      default:
        orderBy = desc(schema.topics.bumpedAt);
    }

    // Fetch topics with author and category
    const topics = await db
      .select({
        id: schema.topics.id,
        title: schema.topics.title,
        slug: schema.topics.slug,
        views: schema.topics.views,
        postsCount: schema.topics.postsCount,
        replyCount: schema.topics.replyCount,
        likeCount: schema.topics.likeCount,
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
      .where(and(...conditions))
      .orderBy(desc(schema.topics.pinned), orderBy)
      .limit(perPage)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.topics)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / perPage);

    // Transform to cleaner format
    const formattedTopics = topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      views: topic.views,
      postsCount: topic.postsCount,
      replyCount: topic.replyCount,
      likeCount: topic.likeCount,
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
    }));

    return NextResponse.json({
      topics: formattedTopics,
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
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, categoryId, tags } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200);

    // Parse markdown to HTML
    const cooked = await parseMarkdownAsync(content);

    // Get user ID from session email
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

    // Create topic
    const topicResult = await db
      .insert(schema.topics)
      .values({
        title: title.trim(),
        slug: `${slug}-${Date.now()}`, // Add timestamp for uniqueness
        userId,
        categoryId: categoryId || null,
        views: 0,
        postsCount: 1,
        replyCount: 0,
        likeCount: 0,
        highestPostNumber: 1,
        lastPostedAt: now,
        bumpedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.topics.id, slug: schema.topics.slug });

    const topicId = topicResult[0].id;

    // Create first post
    await db.insert(schema.posts).values({
      topicId,
      userId,
      postNumber: 1,
      raw: content.trim(),
      cooked,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      topic: {
        id: topicId,
        slug: topicResult[0].slug,
      },
    });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
