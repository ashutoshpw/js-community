/**
 * User Profile API Route
 *
 * GET: Fetch user profile information
 */

import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;

    // Fetch user
    const userResult = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        name: schema.users.name,
        trustLevel: schema.users.trustLevel,
        admin: schema.users.admin,
        moderator: schema.users.moderator,
        createdAt: schema.users.createdAt,
        lastSeenAt: schema.users.lastSeenAt,
      })
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // Fetch user profile
    const profileResult = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, user.id))
      .limit(1);

    const profile = profileResult[0] || null;

    // Fetch user stats
    const statsResult = await db
      .select()
      .from(schema.userStats)
      .where(eq(schema.userStats.userId, user.id))
      .limit(1);

    const stats = statsResult[0] || {
      topicCount: 0,
      postCount: 0,
      likesGiven: 0,
      likesReceived: 0,
      daysVisited: 0,
    };

    // Calculate stats from actual data if no stats record
    const topicCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.topics)
      .where(
        and(eq(schema.topics.userId, user.id), isNull(schema.topics.deletedAt)),
      );

    const postCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.posts)
      .where(
        and(eq(schema.posts.userId, user.id), isNull(schema.posts.deletedAt)),
      );

    // Fetch recent topics
    const recentTopics = await db
      .select({
        id: schema.topics.id,
        title: schema.topics.title,
        slug: schema.topics.slug,
        createdAt: schema.topics.createdAt,
        categoryName: schema.categories.name,
        categoryColor: schema.categories.color,
      })
      .from(schema.topics)
      .leftJoin(
        schema.categories,
        eq(schema.topics.categoryId, schema.categories.id),
      )
      .where(
        and(eq(schema.topics.userId, user.id), isNull(schema.topics.deletedAt)),
      )
      .orderBy(desc(schema.topics.createdAt))
      .limit(5);

    // Fetch badges
    const badges = await db
      .select({
        id: schema.badges.id,
        name: schema.badges.name,
        description: schema.badges.description,
        icon: schema.badges.icon,
        grantedAt: schema.userBadges.grantedAt,
      })
      .from(schema.userBadges)
      .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
      .where(eq(schema.userBadges.userId, user.id))
      .orderBy(desc(schema.userBadges.grantedAt))
      .limit(10);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        trustLevel: user.trustLevel,
        admin: user.admin,
        moderator: user.moderator,
        createdAt: user.createdAt.toISOString(),
        lastSeenAt: user.lastSeenAt?.toISOString() || null,
      },
      profile: profile
        ? {
            location: profile.location,
            website: profile.website,
            bio: profile.bioCooked || profile.bioRaw,
            avatarUrl: profile.avatarUrl,
            profileBackgroundUrl: profile.profileBackgroundUrl,
            views: profile.views,
          }
        : null,
      stats: {
        topicCount: topicCountResult[0]?.count || stats.topicCount || 0,
        postCount: postCountResult[0]?.count || stats.postCount || 0,
        likesGiven: stats.likesGiven || 0,
        likesReceived: stats.likesReceived || 0,
        daysVisited: stats.daysVisited || 0,
      },
      recentTopics,
      badges,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
