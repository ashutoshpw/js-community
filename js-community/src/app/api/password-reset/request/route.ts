/**
 * API route for requesting password reset
 *
 * POST /api/password-reset/request
 * Request body: { email: string }
 */

import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { db } from "@/lib/database";
import { createPasswordResetToken } from "@/lib/password-reset";
import { checkRateLimit, recordAttempt } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
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
    const ipRateLimit = checkRateLimit(`ip:${ip}`);
    const emailRateLimit = checkRateLimit(`email:${email}`);

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
    recordAttempt(`ip:${ip}`);
    recordAttempt(`email:${email}`);

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

    // In a real application, send email here
    // For now, we'll log it (in production, use a proper email service)
    console.log(`Password reset token for ${email}: ${token}`);
    console.log(
      `Reset link: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`,
    );

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, token);

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
