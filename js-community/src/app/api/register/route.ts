/**
 * Custom registration API route that supports username
 * Extends better-auth functionality to include username field
 */

import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { users } from "@/db/schema";
import { db } from "@/lib/database";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    // Validate all fields
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return Response.json({ error: nameValidation.error }, { status: 400 });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return Response.json(
        { error: usernameValidation.error },
        { status: 400 },
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return Response.json({ error: emailValidation.error }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return Response.json(
        { error: passwordValidation.error },
        { status: 400 },
      );
    }

    // Check username availability (case-insensitive)
    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (existingUsername.length > 0) {
      return Response.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    // Check email availability
    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return Response.json(
        { error: "Email is already registered" },
        { status: 400 },
      );
    }

    // Create the user using better-auth
    const signUpResponse = await fetch(
      `${new URL(request.url).origin}/api/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      },
    );

    const signUpData = await signUpResponse.json();

    if (!signUpResponse.ok) {
      return Response.json(
        { error: signUpData.error || "Registration failed" },
        { status: signUpResponse.status },
      );
    }

    // Update the user with username
    // Better-auth creates a user in the users table, so we need to update it
    try {
      await db.update(users).set({ username }).where(eq(users.email, email));
    } catch (updateError) {
      // Handle potential race condition where another request has taken the username
      if (
        updateError instanceof Error &&
        updateError.message.toLowerCase().includes("duplicate") &&
        updateError.message.toLowerCase().includes("username")
      ) {
        return Response.json(
          { error: "Username is already taken" },
          { status: 400 },
        );
      }
      throw updateError;
    }

    return Response.json(
      {
        message: "Registration successful",
        user: {
          email,
          username,
          name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 },
    );
  }
}
