/**
 * API route for confirming password reset
 *
 * POST /api/password-reset/confirm
 * Request body: { token: string, password: string }
 */

import { type NextRequest, NextResponse } from "next/server";
import { updateUserPassword } from "@/lib/auth-password";
import {
  markTokenAsUsed,
  validatePasswordResetToken,
} from "@/lib/password-reset";
import { validatePassword } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 },
      );
    }

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

    await updateUserPassword(userId, password);
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
