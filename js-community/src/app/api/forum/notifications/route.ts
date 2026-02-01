/**
 * Notifications API Route
 *
 * GET: Fetch user notifications
 * PATCH: Mark notifications as read
 */

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const unreadOnly = searchParams.get("unread") === "true";

    // Build query conditions
    const conditions = [eq(schema.notifications.userId, userId)];
    if (unreadOnly) {
      conditions.push(eq(schema.notifications.read, false));
    }

    // Fetch notifications
    const notificationsResult = await db
      .select()
      .from(schema.notifications)
      .where(and(...conditions))
      .orderBy(desc(schema.notifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Get unread count
    const unreadCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.userId, userId),
          eq(schema.notifications.read, false),
        ),
      );

    const unreadCount = unreadCountResult[0]?.count || 0;

    return NextResponse.json({
      notifications: notificationsResult,
      unreadCount,
      hasMore: notificationsResult.length === limit,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
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
    const { notificationIds, markAllRead } = body as {
      notificationIds?: number[];
      markAllRead?: boolean;
    };

    const now = new Date();

    if (markAllRead) {
      // Mark all unread notifications as read
      await db
        .update(schema.notifications)
        .set({ read: true, updatedAt: now })
        .where(
          and(
            eq(schema.notifications.userId, userId),
            eq(schema.notifications.read, false),
          ),
        );

      return NextResponse.json({ success: true, markedAll: true });
    }

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await db
        .update(schema.notifications)
        .set({ read: true, updatedAt: now })
        .where(
          and(
            eq(schema.notifications.userId, userId),
            inArray(schema.notifications.id, notificationIds),
          ),
        );

      return NextResponse.json({
        success: true,
        marked: notificationIds.length,
      });
    }

    return NextResponse.json(
      { error: "No notifications specified" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 },
    );
  }
}
