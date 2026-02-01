/**
 * Admin Users API Route
 *
 * GET: List users with filters
 * POST: Perform admin actions on users
 */

import { asc, count, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, new, active, banned
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(schema.user.name, `%${search}%`),
          ilike(schema.user.email, `%${search}%`),
        ),
      );
    }

    if (filter === "new") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      conditions.push(gte(schema.user.createdAt, weekAgo));
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.user)
      .where(conditions.length > 0 ? sql`${conditions[0]}` : undefined);

    // Get users
    const orderColumn =
      sortBy === "name"
        ? schema.user.name
        : sortBy === "email"
          ? schema.user.email
          : schema.user.createdAt;

    const users = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        username: schema.user.username,
        email: schema.user.email,
        admin: schema.user.admin,
        moderator: schema.user.moderator,
        trustLevel: schema.user.trustLevel,
        active: schema.user.active,
        suspended: schema.user.suspended,
        createdAt: schema.user.createdAt,
        updatedAt: schema.user.updatedAt,
      })
      .from(schema.user)
      .where(conditions.length > 0 ? sql`${conditions[0]}` : undefined)
      .orderBy(sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
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
    const { userId, action, reason } = body as {
      userId: number;
      action: "promote" | "demote" | "ban" | "unban" | "delete";
      reason?: string;
    };

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId and action are required" },
        { status: 400 },
      );
    }

    // Get target user
    const [targetUser] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-actions
    if (String(targetUser.id) === session.user.id) {
      return NextResponse.json(
        { error: "Cannot perform actions on yourself" },
        { status: 400 },
      );
    }

    switch (action) {
      case "promote":
        await db
          .update(schema.user)
          .set({ admin: true })
          .where(eq(schema.user.id, userId));
        break;

      case "demote":
        await db
          .update(schema.user)
          .set({ admin: false })
          .where(eq(schema.user.id, userId));
        break;

      case "ban":
        // Add to user_bans table if it exists
        await db.insert(schema.userBans).values({
          userId,
          bannedById: Number(session.user.id),
          reason: reason || "Banned by admin",
          isPermanent: true,
          isActive: true,
        });
        break;

      case "unban":
        await db
          .update(schema.userBans)
          .set({
            isActive: false,
            unbannedAt: new Date(),
            unbannedById: Number(session.user.id),
          })
          .where(eq(schema.userBans.userId, userId));
        break;

      case "delete":
        // Soft delete or hard delete based on policy
        await db.delete(schema.user).where(eq(schema.user.id, userId));
        break;
    }

    // Log admin action
    await db.insert(schema.adminActions).values({
      userId: Number(session.user.id),
      action: `user_${action}`,
      targetType: "user",
      targetId: userId,
      details: JSON.stringify({ reason }),
    });

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error("Error performing user action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 },
    );
  }
}
