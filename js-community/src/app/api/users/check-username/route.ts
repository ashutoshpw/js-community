/**
 * API route to check username availability
 */

import { sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { users } from "@/db/schema";
import { db } from "@/lib/database";
import { validateUsername } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    // Validate username format
    const validation = validateUsername(username);
    if (!validation.valid) {
      return Response.json(
        { available: false, error: validation.error },
        { status: 200 },
      );
    }

    // Check if username exists in database (case-insensitive)
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    const available = existingUser.length === 0;

    return Response.json(
      {
        available,
        error: available ? undefined : "Username is already taken",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username availability:", error);
    return Response.json(
      { error: "Failed to check username availability" },
      { status: 500 },
    );
  }
}
