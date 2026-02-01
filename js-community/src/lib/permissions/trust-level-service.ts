/**
 * Trust Level Service
 *
 * Handles automatic promotion and trust level calculations.
 */

import { count, eq, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { NOTIFICATION_TYPES } from "@/db/schema/notifications";
import { db } from "@/lib/database";
import {
  meetsRequirements,
  TRUST_LEVELS,
  type TrustLevel,
  type UserStats,
} from "@/lib/permissions";

/**
 * Get user stats for trust level calculation
 */
export async function getUserStats(userId: number): Promise<UserStats> {
  // Get days visited (unique days with activity)
  // This would typically come from a user_visits table
  // For now, we'll calculate from post creation dates
  const postsResult = await db
    .select({
      count: count(),
    })
    .from(schema.posts)
    .where(eq(schema.posts.userId, userId));

  const topicsResult = await db
    .select({
      count: count(),
    })
    .from(schema.topics)
    .where(eq(schema.topics.userId, userId));

  // Get likes received (from userActions)
  const likesReceived = await db
    .select({ count: count() })
    .from(schema.userActions)
    .where(
      sql`${schema.userActions.targetUserId} = ${userId} AND ${schema.userActions.actionType} = 'like'`,
    );

  // Get likes given
  const likesGiven = await db
    .select({ count: count() })
    .from(schema.userActions)
    .where(
      sql`${schema.userActions.actingUserId} = ${userId} AND ${schema.userActions.actionType} = 'like'`,
    );

  // Get user stats from user_stats table if available
  const [userStatsRow] = await db
    .select()
    .from(schema.userStats)
    .where(eq(schema.userStats.userId, userId))
    .limit(1);

  return {
    daysVisited: userStatsRow?.daysVisited || 1,
    topicsEntered: userStatsRow?.topicsEntered || 0,
    postsRead: userStatsRow?.postsReadCount || 0,
    timeRead: userStatsRow?.timeRead || 0,
    likesReceived: likesReceived[0]?.count || 0,
    likesGiven: likesGiven[0]?.count || 0,
    topicsCreated: topicsResult[0]?.count || 0,
    postsCreated: postsResult[0]?.count || 0,
  };
}

/**
 * Get user's current trust level
 */
export async function getUserTrustLevel(userId: number): Promise<TrustLevel> {
  // Check for manual trust level grants first
  const [grant] = await db
    .select()
    .from(schema.trustLevelGrants)
    .where(eq(schema.trustLevelGrants.userId, userId))
    .limit(1);

  if (grant) {
    return grant.trustLevel as TrustLevel;
  }

  // Otherwise check user's trust level directly
  const [user] = await db
    .select({ trustLevel: schema.users.trustLevel })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return (user?.trustLevel ?? TRUST_LEVELS.NEW_USER) as TrustLevel;
}

/**
 * Check if user qualifies for promotion and promote if so
 */
export async function checkAndPromoteUser(userId: number): Promise<{
  promoted: boolean;
  newLevel?: TrustLevel;
  oldLevel?: TrustLevel;
}> {
  const currentLevel = await getUserTrustLevel(userId);
  const stats = await getUserStats(userId);

  // Already at max level
  if (currentLevel >= TRUST_LEVELS.LEADER) {
    return { promoted: false };
  }

  const nextLevel = (currentLevel + 1) as TrustLevel;

  // Check if meets requirements for next level
  if (meetsRequirements(stats, nextLevel)) {
    // Update trust level on users table
    await db
      .update(schema.users)
      .set({ trustLevel: nextLevel })
      .where(eq(schema.users.id, userId));

    // Log the promotion
    await db.insert(schema.trustLevelGrants).values({
      userId,
      trustLevel: nextLevel,
      grantedById: null, // System promotion
    });

    // Create notification
    await db.insert(schema.notifications).values({
      userId,
      notificationType: NOTIFICATION_TYPES.trust_level_change,
      data: {
        display_username: `Trust Level ${nextLevel}`,
        original_post_id: currentLevel,
        original_post_type: nextLevel,
      },
    });

    return {
      promoted: true,
      oldLevel: currentLevel,
      newLevel: nextLevel,
    };
  }

  return { promoted: false };
}

/**
 * Manually set user trust level (admin action)
 */
export async function setUserTrustLevel(
  userId: number,
  newLevel: TrustLevel,
  grantedById: number,
): Promise<void> {
  // Update user's trust level
  await db
    .update(schema.users)
    .set({ trustLevel: newLevel })
    .where(eq(schema.users.id, userId));

  // Record the grant
  await db.insert(schema.trustLevelGrants).values({
    userId,
    trustLevel: newLevel,
    grantedById,
  });

  // Log admin action
  await db.insert(schema.adminActions).values({
    userId: grantedById,
    action: "trust_level_change",
    targetType: "user",
    targetId: userId,
    details: JSON.stringify({ newLevel }),
  });

  // Notify user
  await db.insert(schema.notifications).values({
    userId,
    notificationType: NOTIFICATION_TYPES.trust_level_change,
    data: {
      display_username: `Trust Level ${newLevel}`,
      original_post_type: newLevel,
    },
  });
}

/**
 * Batch check and promote all eligible users
 * This should be run periodically (e.g., daily cron job)
 */
export async function runTrustLevelPromotions(): Promise<{
  checked: number;
  promoted: number;
}> {
  // Get all users who are not at max level
  const eligibleUsers = await db
    .select({ userId: schema.users.id })
    .from(schema.users)
    .where(sql`${schema.users.trustLevel} < ${TRUST_LEVELS.LEADER}`);

  let promoted = 0;

  for (const { userId } of eligibleUsers) {
    const result = await checkAndPromoteUser(userId);
    if (result.promoted) {
      promoted++;
    }
  }

  return {
    checked: eligibleUsers.length,
    promoted,
  };
}
