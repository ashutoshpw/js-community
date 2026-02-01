/**
 * Admin Review Item API Route
 *
 * POST: Take action on a reviewable item
 */

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reviewableId = Number(id);

    if (!reviewableId || Number.isNaN(reviewableId)) {
      return NextResponse.json(
        { error: "Invalid reviewable ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { action, reason } = body as {
      action: "approve" | "reject" | "ignore";
      reason?: string;
    };

    if (!action || !["approve", "reject", "ignore"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be approve, reject, or ignore" },
        { status: 400 },
      );
    }

    // Get reviewable
    const [reviewable] = await db
      .select()
      .from(schema.reviewables)
      .where(eq(schema.reviewables.id, reviewableId))
      .limit(1);

    if (!reviewable) {
      return NextResponse.json(
        { error: "Reviewable not found" },
        { status: 404 },
      );
    }

    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      ignore: "ignored",
    };

    // Update reviewable status
    await db
      .update(schema.reviewables)
      .set({
        status: statusMap[action],
        reviewedById: Number(session.user.id),
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.reviewables.id, reviewableId));

    // If rejecting, take action on the target
    if (action === "reject") {
      if (reviewable.targetType === "post") {
        // Soft delete the post (set deletedAt)
        await db
          .update(schema.posts)
          .set({ deletedAt: new Date() })
          .where(eq(schema.posts.id, reviewable.targetId));
      } else if (reviewable.targetType === "topic") {
        // Close the topic
        await db
          .update(schema.topics)
          .set({ closedAt: new Date() })
          .where(eq(schema.topics.id, reviewable.targetId));
      }
    }

    // Log moderator action
    await db.insert(schema.moderatorActions).values({
      userId: Number(session.user.id),
      action: `reviewable_${action}`,
      targetType: reviewable.targetType,
      targetId: reviewable.targetId,
      reason: reason || null,
      reviewableId,
    });

    return NextResponse.json({
      success: true,
      status: statusMap[action],
    });
  } catch (error) {
    console.error("Error processing review action:", error);
    return NextResponse.json(
      { error: "Failed to process action" },
      { status: 500 },
    );
  }
}
