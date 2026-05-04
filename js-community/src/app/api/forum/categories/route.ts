/**
 * Categories API Route
 *
 * GET: Returns all categories with topic counts
 *
 * Results are cached in the query_cache table for 5 minutes
 * to reduce repeated DB reads on every forum page load.
 */

import { NextResponse } from "next/server";
import { getForumCategories } from "@/lib/forum-data";
import { getCached } from "@/lib/cache";

export async function GET() {
  try {
    const categories = await getCached(
      "forum:categories",
      300, // 5 minutes
      () => getForumCategories(),
    );

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
