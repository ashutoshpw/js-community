/**
 * Categories API Route
 *
 * GET: Returns all categories with topic counts
 */

import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

export async function GET() {
  try {
    // Get all categories with topic counts
    const categories = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        color: schema.categories.color,
        textColor: schema.categories.textColor,
        description: schema.categories.description,
        position: schema.categories.position,
        parentCategoryId: schema.categories.parentCategoryId,
        topicCount: sql<number>`count(distinct ${schema.topics.id})`.as(
          "topic_count",
        ),
      })
      .from(schema.categories)
      .leftJoin(
        schema.topics,
        eq(schema.topics.categoryId, schema.categories.id),
      )
      .groupBy(schema.categories.id)
      .orderBy(schema.categories.position);

    // Organize into hierarchy (parent categories with subcategories)
    const parentCategories = categories.filter((c) => !c.parentCategoryId);
    const childCategories = categories.filter((c) => c.parentCategoryId);

    const result = parentCategories.map((parent) => ({
      ...parent,
      subcategories: childCategories.filter(
        (child) => child.parentCategoryId === parent.id,
      ),
    }));

    return NextResponse.json({
      categories: result,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
