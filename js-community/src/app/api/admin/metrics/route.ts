/**
 * Admin Metrics API Route
 *
 * GET: Get dashboard metrics
 */

import { and, count, desc, eq, gte, ne, sql } from "drizzle-orm";
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

    const calculateTrend = (todayCount: number, yesterdayCount: number): number =>
      yesterdayCount > 0
        ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
        : todayCount > 0
          ? 100
          : 0;

    // Get user counts
    const [totalUsers] = await db.select({ count: count() }).from(schema.users);

    const [newUsersToday] = await db
      .select({ count: count() })
      .from(schema.users)
      .where(gte(schema.users.createdAt, startOfToday));

    const [activeUsersToday] = await db
      .select({ count: count() })
      .from(schema.users)
      .where(gte(schema.users.lastSeenAt, startOfToday));

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

    const [resolvedFlagsToday] = await db
      .select({ count: count() })
      .from(schema.reviewables)
      .where(
        and(
          ne(schema.reviewables.status, "pending"),
          gte(schema.reviewables.reviewedAt, startOfToday),
        ),
      );

    // Calculate trends (simplified - compare today to yesterday)
    const [newUsersYesterday] = await db
      .select({ count: count() })
      .from(schema.users)
      .where(
        sql`${schema.users.createdAt} >= ${startOfYesterday} AND ${schema.users.createdAt} < ${startOfToday}`,
      );

    const [newTopicsYesterday] = await db
      .select({ count: count() })
      .from(schema.topics)
      .where(
        sql`${schema.topics.createdAt} >= ${startOfYesterday} AND ${schema.topics.createdAt} < ${startOfToday}`,
      );

    const [newPostsYesterday] = await db
      .select({ count: count() })
      .from(schema.posts)
      .where(
        sql`${schema.posts.createdAt} >= ${startOfYesterday} AND ${schema.posts.createdAt} < ${startOfToday}`,
      );

    const recentActions = await db
      .select({
        id: schema.adminActions.id,
        action: schema.adminActions.action,
        user: schema.users.username,
        target: sql<string>`coalesce(${schema.adminActions.targetType}, 'site')`,
        createdAt: schema.adminActions.createdAt,
      })
      .from(schema.adminActions)
      .leftJoin(schema.users, eq(schema.adminActions.userId, schema.users.id))
      .orderBy(desc(schema.adminActions.createdAt))
      .limit(10);

    return NextResponse.json({
      users: {
        total: totalUsers.count,
        newToday: newUsersToday.count,
        activeToday: activeUsersToday.count,
        trend: calculateTrend(newUsersToday.count, newUsersYesterday.count),
      },
      topics: {
        total: totalTopics.count,
        newToday: newTopicsToday.count,
        trend: calculateTrend(newTopicsToday.count, newTopicsYesterday.count),
      },
      posts: {
        total: totalPosts.count,
        newToday: newPostsToday.count,
        trend: calculateTrend(newPostsToday.count, newPostsYesterday.count),
      },
      flags: {
        pending: pendingFlags.count,
        resolvedToday: resolvedFlagsToday.count,
      },
      recentActions,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
