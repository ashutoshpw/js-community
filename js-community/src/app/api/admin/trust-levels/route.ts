/**
 * Admin Trust Levels API Route
 *
 * GET: Get user trust level info
 * POST: Update user trust level
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import {
  calculateProgress,
  getTrustLevelName,
  type TrustLevel,
} from "@/lib/permissions";
import {
  getUserStats,
  getUserTrustLevel,
  setUserTrustLevel,
} from "@/lib/permissions/trust-level-service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const currentLevel = await getUserTrustLevel(userId);
    const stats = await getUserStats(userId);
    const progress = calculateProgress(stats, currentLevel);

    return NextResponse.json({
      userId,
      currentLevel,
      currentLevelName: getTrustLevelName(currentLevel),
      stats,
      progress: progress.progress,
      canPromote: progress.canPromote,
      nextLevel: progress.nextLevel,
      nextLevelName: progress.nextLevel
        ? getTrustLevelName(progress.nextLevel)
        : null,
    });
  } catch (error) {
    console.error("Error fetching trust level:", error);
    return NextResponse.json(
      { error: "Failed to fetch trust level" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, trustLevel } = body as {
      userId: number;
      trustLevel: TrustLevel;
    };

    if (!userId || trustLevel === undefined) {
      return NextResponse.json(
        { error: "userId and trustLevel are required" },
        { status: 400 },
      );
    }

    if (trustLevel < 0 || trustLevel > 4) {
      return NextResponse.json(
        { error: "Invalid trust level. Must be 0-4" },
        { status: 400 },
      );
    }

    await setUserTrustLevel(userId, trustLevel, Number(session.user.id));

    return NextResponse.json({
      success: true,
      userId,
      newLevel: trustLevel,
      newLevelName: getTrustLevelName(trustLevel),
    });
  } catch (error) {
    console.error("Error updating trust level:", error);
    return NextResponse.json(
      { error: "Failed to update trust level" },
      { status: 500 },
    );
  }
}
