/**
 * API route for confirming password reset
 *
 * POST /api/password-reset/confirm
 * Request body: { token: string, password: string }
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  markTokenAsUsed,
  validatePasswordResetToken,
} from "@/lib/password-reset";
import { validatePassword } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 },
      );
    }

    // Validate token
    const tokenValidation = await validatePasswordResetToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json(
        { error: tokenValidation.error },
        { status: 400 },
      );
    }

    const userId = tokenValidation.userId;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Update password using better-auth
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to reset password" },
        { status: response.status },
      );
    }

    // Mark token as used
    await markTokenAsUsed(token);

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset confirm error:", error);
    return NextResponse.json(
      { error: "An error occurred while resetting your password" },
      { status: 500 },
    );
  }
}
