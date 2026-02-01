/**
 * Admin Category ID API Route
 *
 * PUT: Update a category
 * DELETE: Delete a category
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const categoryId = Number(id);

    if (!categoryId || Number.isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, slug, description, color, position } = body as {
      name?: string;
      slug?: string;
      description?: string;
      color?: string;
      position?: number;
    };

    // Check if category exists
    const [existing] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, categoryId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const [slugExists] = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.slug, slug))
        .limit(1);

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const [updated] = await db
      .update(schema.categories)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
        ...(position !== undefined && { position }),
        updatedAt: new Date(),
      })
      .where(eq(schema.categories.id, categoryId))
      .returning();

    // Log admin action
    await db.insert(schema.adminActions).values({
      userId: Number(session.user.id),
      action: "category_update",
      targetType: "category",
      targetId: categoryId,
      details: JSON.stringify({ name, slug }),
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const categoryId = Number(id);

    if (!categoryId || Number.isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    // Check if category exists
    const [existing] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, categoryId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if category has topics
    const [{ count: topicCount }] = await db
      .select({ count: schema.topics.id })
      .from(schema.topics)
      .where(eq(schema.topics.categoryId, categoryId))
      .limit(1);

    if (topicCount) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with existing topics. Move or delete topics first.",
        },
        { status: 400 },
      );
    }

    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, categoryId));

    // Log admin action
    await db.insert(schema.adminActions).values({
      userId: Number(session.user.id),
      action: "category_delete",
      targetType: "category",
      targetId: categoryId,
      details: JSON.stringify({ name: existing.name }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
