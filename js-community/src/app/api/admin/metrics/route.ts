/**
 * Admin Metrics API Route
 *
 * GET: Get dashboard metrics
 */

import { count, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Get user counts
    const [totalUsers] = await db.select({ count: count() }).from(schema.user);

    const [newUsersToday] = await db
      .select({ count: count() })
      .from(schema.user)
      .where(gte(schema.user.createdAt, startOfToday));

    // Get topic counts
    const [totalTopics] = await db
      .select({ count: count() })
      .from(schema.topics);

    const [newTopicsToday] = await db
      .select({ count: count() })
      .from(schema.topics)
      .where(gte(schema.topics.createdAt, startOfToday));

    // Get post counts
    const [totalPosts] = await db.select({ count: count() }).from(schema.posts);

    const [newPostsToday] = await db
      .select({ count: count() })
      .from(schema.posts)
      .where(gte(schema.posts.createdAt, startOfToday));

    // Get flag counts (from reviewables with status 'pending')
    const [pendingFlags] = await db
      .select({ count: count() })
      .from(schema.reviewables)
      .where(eq(schema.reviewables.status, "pending"));

    // Calculate trends (simplified - compare today to yesterday)
    const [newUsersYesterday] = await db
      .select({ count: count() })
      .from(schema.user)
      .where(
        sql`${schema.user.createdAt} >= ${startOfYesterday} AND ${schema.user.createdAt} < ${startOfToday}`,
      );

    const userTrend =
      newUsersYesterday.count > 0
        ? Math.round(
            ((newUsersToday.count - newUsersYesterday.count) /
              newUsersYesterday.count) *
              100,
          )
        : newUsersToday.count > 0
          ? 100
          : 0;

    return NextResponse.json({
      users: {
        total: totalUsers.count,
        newToday: newUsersToday.count,
        activeToday: 0, // Would need activity tracking
        trend: userTrend,
      },
      topics: {
        total: totalTopics.count,
        newToday: newTopicsToday.count,
        trend: 0,
      },
      posts: {
        total: totalPosts.count,
        newToday: newPostsToday.count,
        trend: 0,
      },
      flags: {
        pending: pendingFlags.count,
        resolvedToday: 0,
      },
      recentActions: [],
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
