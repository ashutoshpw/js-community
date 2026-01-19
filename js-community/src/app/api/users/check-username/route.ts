/**
 * API route to check username availability
 */

import { db } from "@/lib/database";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateUsername } from "@/lib/validation";
import type { NextRequest } from "next/server";

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

    // Check if username exists in database
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
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
