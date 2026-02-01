/**
 * User Search API Route
 *
 * GET: Search for users by username or name
 */

import { ilike, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 20);

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const pattern = `%${query}%`;

    const users = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        name: schema.users.name,
      })
      .from(schema.users)
      .where(
        or(
          ilike(schema.users.username, pattern),
          ilike(schema.users.name, pattern),
        ),
      )
      .limit(limit);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 },
    );
  }
}
