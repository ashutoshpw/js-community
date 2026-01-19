/**
 * API route to fetch and update user profile data
 */

import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { userProfiles, users } from "@/db/schema";
import { badges, userBadges } from "@/db/schema/permissions";
import { db } from "@/lib/database";
import { getServerSession } from "@/lib/session";

/**
 * GET /api/users/[username]
 * Fetch user profile data including badges and stats
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    if (!username) {
      return Response.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    // Fetch user with profile
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        trustLevel: users.trustLevel,
        admin: users.admin,
        moderator: users.moderator,
        active: users.active,
        suspended: users.suspended,
        createdAt: users.createdAt,
        lastSeenAt: users.lastSeenAt,
        profileId: userProfiles.id,
        location: userProfiles.location,
        website: userProfiles.website,
        bioRaw: userProfiles.bioRaw,
        bioCooked: userProfiles.bioCooked,
        avatarUrl: userProfiles.avatarUrl,
        profileBackgroundUrl: userProfiles.profileBackgroundUrl,
        cardBackgroundUrl: userProfiles.cardBackgroundUrl,
        views: userProfiles.views,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user badges
    const userBadgesList = await db
      .select({
        id: userBadges.id,
        badgeId: userBadges.badgeId,
        grantedAt: userBadges.grantedAt,
        featured: userBadges.featured,
        badgeName: badges.name,
        badgeDescription: badges.description,
        badgeIcon: badges.icon,
        badgeImageUrl: badges.imageUrl,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, user.id))
      .orderBy(userBadges.grantedAt);

    // Increment profile views
    if (user.profileId) {
      await db
        .update(userProfiles)
        .set({ views: sql`${userProfiles.views} + 1` })
        .where(eq(userProfiles.id, user.profileId));
    }

    return Response.json(
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          trustLevel: user.trustLevel,
          admin: user.admin,
          moderator: user.moderator,
          active: user.active,
          suspended: user.suspended,
          createdAt: user.createdAt,
          lastSeenAt: user.lastSeenAt,
        },
        profile: {
          location: user.location,
          website: user.website,
          bioRaw: user.bioRaw,
          bioCooked: user.bioCooked,
          avatarUrl: user.avatarUrl,
          profileBackgroundUrl: user.profileBackgroundUrl,
          cardBackgroundUrl: user.cardBackgroundUrl,
          views: user.views || 0,
        },
        badges: userBadgesList,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/[username]
 * Update user profile data (only own profile)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const session = await getServerSession(request.headers);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;
    const body = await request.json();

    // Find the user being updated
    const [targetUser] = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user is updating their own profile
    if (Number(session.user.id) !== targetUser.id) {
      return Response.json(
        { error: "You can only update your own profile" },
        { status: 403 },
      );
    }

    // Update user fields if provided
    const userUpdates: Partial<typeof users.$inferInsert> = {};
    if (body.name !== undefined) {
      userUpdates.name = body.name;
    }

    if (Object.keys(userUpdates).length > 0) {
      await db
        .update(users)
        .set(userUpdates)
        .where(eq(users.id, targetUser.id));
    }

    // Update or create profile
    const profileUpdates: Partial<typeof userProfiles.$inferInsert> = {};
    if (body.location !== undefined) {
      profileUpdates.location = body.location;
    }
    if (body.website !== undefined) {
      profileUpdates.website = body.website;
    }
    if (body.bioRaw !== undefined) {
      profileUpdates.bioRaw = body.bioRaw;
      // In a real app, you'd process markdown here
      profileUpdates.bioCooked = body.bioRaw;
    }

    if (Object.keys(profileUpdates).length > 0) {
      // Check if profile exists
      const [existingProfile] = await db
        .select({ id: userProfiles.id })
        .from(userProfiles)
        .where(eq(userProfiles.userId, targetUser.id))
        .limit(1);

      if (existingProfile) {
        await db
          .update(userProfiles)
          .set(profileUpdates)
          .where(eq(userProfiles.userId, targetUser.id));
      } else {
        await db.insert(userProfiles).values({
          userId: targetUser.id,
          ...profileUpdates,
        });
      }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return Response.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }
}
