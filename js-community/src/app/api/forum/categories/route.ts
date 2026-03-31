/**
 * Categories API Route
 *
 * GET: Returns all categories with topic counts
 */

import { NextResponse } from "next/server";
import { getForumCategories } from "@/lib/forum-data";

export async function GET() {
  try {
    const categories = await getForumCategories();

    return NextResponse.json({
      categories,
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
