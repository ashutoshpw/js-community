/**
 * Admin Categories API Route
 *
 * POST: Create a new category
 */

import { eq, max } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, color } = body as {
      name: string;
      slug: string;
      description?: string;
      color?: string;
    };

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const [existing] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 },
      );
    }

    // Get max position
    const [{ maxPos }] = await db
      .select({ maxPos: max(schema.categories.position) })
      .from(schema.categories);

    const position = (maxPos || 0) + 1;

    const [newCategory] = await db
      .insert(schema.categories)
      .values({
        name,
        slug,
        description: description || null,
        color: color || "#0088CC",
        position,
      })
      .returning();

    // Log admin action
    await db.insert(schema.adminActions).values({
      userId: Number(session.user.id),
      action: "category_create",
      targetType: "category",
      targetId: newCategory.id,
      details: JSON.stringify({ name, slug }),
    });

    return NextResponse.json({ category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
