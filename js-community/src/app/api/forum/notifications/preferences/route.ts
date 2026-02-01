/**
 * Notification Preferences API Route
 *
 * GET: Fetch user notification preferences
 * PATCH: Update user notification preferences
 */

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Fetch preferences
    const prefsResult = await db
      .select()
      .from(schema.notificationPreferences)
      .where(eq(schema.notificationPreferences.userId, userId))
      .limit(1);

    if (prefsResult.length === 0) {
      // Return default preferences
      return NextResponse.json({
        preferences: {
          emailOnMention: true,
          emailOnReply: true,
          emailOnQuote: true,
          emailOnLike: false,
          emailOnPrivateMessage: true,
          emailDigestFrequency: "daily",
          mutedCategories: [],
          mutedTags: [],
        },
      });
    }

    return NextResponse.json({ preferences: prefsResult[0] });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const userResult = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email || ""))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;
    const body = await request.json();
    const now = new Date();

    // Check if preferences exist
    const existingPrefs = await db
      .select({ id: schema.notificationPreferences.id })
      .from(schema.notificationPreferences)
      .where(eq(schema.notificationPreferences.userId, userId))
      .limit(1);

    if (existingPrefs.length === 0) {
      // Create new preferences
      await db.insert(schema.notificationPreferences).values({
        userId,
        ...body,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing preferences
      await db
        .update(schema.notificationPreferences)
        .set({
          ...body,
          updatedAt: now,
        })
        .where(eq(schema.notificationPreferences.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}
