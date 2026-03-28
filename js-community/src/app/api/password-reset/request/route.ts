/**
 * API route for requesting password reset
 *
 * POST /api/password-reset/request
 * Request body: { email: string }
 */

import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { isEmailDeliveryConfigured } from "@/lib/alpha-features";
import { db } from "@/lib/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { createPasswordResetToken } from "@/lib/password-reset";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production" && !isEmailDeliveryConfigured()) {
      return NextResponse.json(
        { error: "Password reset is temporarily unavailable." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 },
      );
    }

    // Get IP address for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit (by IP and email)
    const [ipRateLimit, emailRateLimit] = await Promise.all([
      checkRateLimit(`ip:${ip}`),
      checkRateLimit(`email:${email}`),
    ]);

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many password reset requests. Please try again later.`,
          blockedUntil: ipRateLimit.blockedUntil,
        },
        { status: 429 },
      );
    }

    if (!emailRateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many password reset requests for this email. Please try again later.`,
          blockedUntil: emailRateLimit.blockedUntil,
        },
        { status: 429 },
      );
    }

    // Record the attempt
    await Promise.all([
      recordAttempt(`ip:${ip}`),
      recordAttempt(`email:${email}`),
    ]);

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    // Even if the user doesn't exist, we return success
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Generate reset token
    const token = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail({ email, token });

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
