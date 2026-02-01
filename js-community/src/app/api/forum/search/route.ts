/**
 * Search API Route
 *
 * GET: Search topics and posts using PostgreSQL full-text search
 */

import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

interface SearchResult {
  type: "topic" | "post";
  id: number;
  topicId: number;
  title: string;
  excerpt: string;
  username: string;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryColor: string | null;
  createdAt: string;
  postNumber?: number;
  headline?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type") || "all"; // all, topics, posts
    const categoryId = searchParams.get("category");
    const username = searchParams.get("user");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const offset = Number(searchParams.get("offset")) || 0;

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 },
      );
    }

    // Prepare search terms for PostgreSQL full-text search
    const searchTerms = query
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => term.replace(/[^\w]/g, ""))
      .filter((term) => term.length > 0)
      .join(" & ");

    const likePattern = `%${query}%`;
    const results: SearchResult[] = [];

    // Search topics
    if (type === "all" || type === "topics") {
      const topicConditions = [
        isNull(schema.topics.deletedAt),
        eq(schema.topics.visible, true),
        or(
          ilike(schema.topics.title, likePattern),
          sql`to_tsvector('english', ${schema.topics.title}) @@ to_tsquery('english', ${searchTerms})`,
        ),
      ];

      if (categoryId) {
        topicConditions.push(eq(schema.topics.categoryId, Number(categoryId)));
      }

      if (username) {
        const userResult = await db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(ilike(schema.users.username, username))
          .limit(1);

        if (userResult.length > 0) {
          topicConditions.push(eq(schema.topics.userId, userResult[0].id));
        }
      }

      const topicsResult = await db
        .select({
          id: schema.topics.id,
          title: schema.topics.title,
          createdAt: schema.topics.createdAt,
          categoryId: schema.topics.categoryId,
          userId: schema.topics.userId,
          username: schema.users.username,
          categoryName: schema.categories.name,
          categorySlug: schema.categories.slug,
          categoryColor: schema.categories.color,
        })
        .from(schema.topics)
        .leftJoin(schema.users, eq(schema.topics.userId, schema.users.id))
        .leftJoin(
          schema.categories,
          eq(schema.topics.categoryId, schema.categories.id),
        )
        .where(and(...topicConditions))
        .orderBy(desc(schema.topics.createdAt))
        .limit(limit)
        .offset(offset);

      // Get first post content for each topic as excerpt
      for (const topic of topicsResult) {
        const firstPost = await db
          .select({ raw: schema.posts.raw })
          .from(schema.posts)
          .where(
            and(
              eq(schema.posts.topicId, topic.id),
              eq(schema.posts.postNumber, 1),
              isNull(schema.posts.deletedAt),
            ),
          )
          .limit(1);

        const excerpt = firstPost[0]?.raw
          ? firstPost[0].raw.slice(0, 200).replace(/\n/g, " ") +
            (firstPost[0].raw.length > 200 ? "..." : "")
          : "";

        results.push({
          type: "topic",
          id: topic.id,
          topicId: topic.id,
          title: topic.title,
          excerpt,
          username: topic.username || "Unknown",
          categoryId: topic.categoryId,
          categoryName: topic.categoryName,
          categorySlug: topic.categorySlug,
          categoryColor: topic.categoryColor,
          createdAt: topic.createdAt.toISOString(),
        });
      }
    }

    // Search posts
    if (type === "all" || type === "posts") {
      const postConditions = [
        isNull(schema.posts.deletedAt),
        eq(schema.posts.hidden, false),
        or(
          ilike(schema.posts.raw, likePattern),
          sql`to_tsvector('english', ${schema.posts.raw}) @@ to_tsquery('english', ${searchTerms})`,
        ),
      ];

      if (username) {
        const userResult = await db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(ilike(schema.users.username, username))
          .limit(1);

        if (userResult.length > 0) {
          postConditions.push(eq(schema.posts.userId, userResult[0].id));
        }
      }

      if (categoryId) {
        postConditions.push(eq(schema.topics.categoryId, Number(categoryId)));
      }

      const postsQuery = db
        .select({
          id: schema.posts.id,
          topicId: schema.posts.topicId,
          postNumber: schema.posts.postNumber,
          raw: schema.posts.raw,
          createdAt: schema.posts.createdAt,
          username: schema.users.username,
          topicTitle: schema.topics.title,
          categoryId: schema.topics.categoryId,
          categoryName: schema.categories.name,
          categorySlug: schema.categories.slug,
          categoryColor: schema.categories.color,
        })
        .from(schema.posts)
        .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
        .leftJoin(schema.topics, eq(schema.posts.topicId, schema.topics.id))
        .leftJoin(
          schema.categories,
          eq(schema.topics.categoryId, schema.categories.id),
        )
        .where(and(...postConditions))
        .orderBy(desc(schema.posts.createdAt))
        .limit(limit)
        .offset(offset);

      const postsResult = await postsQuery;

      for (const post of postsResult) {
        // Create excerpt with highlighted search terms
        const excerpt = post.raw
          ? post.raw.slice(0, 200).replace(/\n/g, " ") +
            (post.raw.length > 200 ? "..." : "")
          : "";

        results.push({
          type: "post",
          id: post.id,
          topicId: post.topicId,
          title: post.topicTitle || "Untitled",
          excerpt,
          username: post.username || "Unknown",
          categoryId: post.categoryId,
          categoryName: post.categoryName,
          categorySlug: post.categorySlug,
          categoryColor: post.categoryColor,
          createdAt: post.createdAt.toISOString(),
          postNumber: post.postNumber,
        });
      }
    }

    // Sort combined results by date
    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({
      results: results.slice(0, limit),
      query,
      hasMore: results.length > limit,
      total: results.length,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
