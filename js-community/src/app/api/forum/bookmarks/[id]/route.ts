/**
 * Individual Bookmark API Route
 *
 * PATCH: Update a bookmark
 * DELETE: Delete a bookmark
 */

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookmarkId = Number.parseInt(id, 10);

    if (Number.isNaN(bookmarkId)) {
      return NextResponse.json(
        { error: "Invalid bookmark ID" },
        { status: 400 },
      );
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

    // Check bookmark exists and belongs to user
    const bookmark = await db
      .select({ id: schema.bookmarks.id })
      .from(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.id, bookmarkId),
          eq(schema.bookmarks.userId, userId),
        ),
      )
      .limit(1);

    if (bookmark.length === 0) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { name, reminderAt, pinned } = body as {
      name?: string;
      reminderAt?: string | null;
      pinned?: boolean;
    };

    const now = new Date();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (name !== undefined) {
      updateData.name = name || null;
    }
    if (reminderAt !== undefined) {
      updateData.reminderAt = reminderAt ? new Date(reminderAt) : null;
      updateData.reminderSetAt = reminderAt ? now : null;
    }
    if (pinned !== undefined) {
      updateData.pinned = pinned;
    }

    await db
      .update(schema.bookmarks)
      .set(updateData)
      .where(eq(schema.bookmarks.id, bookmarkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookmarkId = Number.parseInt(id, 10);

    if (Number.isNaN(bookmarkId)) {
      return NextResponse.json(
        { error: "Invalid bookmark ID" },
        { status: 400 },
      );
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
    const now = new Date();

    // Soft delete the bookmark
    await db
      .update(schema.bookmarks)
      .set({ deletedAt: now, updatedAt: now })
      .where(
        and(
          eq(schema.bookmarks.id, bookmarkId),
          eq(schema.bookmarks.userId, userId),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}
