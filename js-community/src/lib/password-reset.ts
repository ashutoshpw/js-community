/**
 * Password reset token utilities
 *
 * This module provides secure token generation and validation
 * for password reset functionality.
 */

import { randomBytes } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { passwordResetTokens } from "@/db/schema";
import { db } from "@/lib/database";

/**
 * Token expiry time in milliseconds (1 hour)
 */
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  // Generate 32 random bytes and convert to hex (64 characters)
  return randomBytes(32).toString("hex");
}

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(
  userId: number,
): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await db.insert(passwordResetTokens).values({
    id: randomBytes(16).toString("hex"),
    userId,
    token,
    expiresAt,
    used: false,
  });

  return token;
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(token: string): Promise<{
  valid: boolean;
  userId?: number;
  error?: string;
}> {
  if (!token) {
    return { valid: false, error: "Token is required" };
  }

  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!resetToken) {
    return { valid: false, error: "Invalid token" };
  }

  if (resetToken.used) {
    return { valid: false, error: "Token has already been used" };
  }

  if (new Date() > resetToken.expiresAt) {
    return { valid: false, error: "Token has expired" };
  }

  return { valid: true, userId: resetToken.userId };
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.token, token));
}

/**
 * Clean up expired tokens (can be called periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await db
    .delete(passwordResetTokens)
    .where(lt(passwordResetTokens.expiresAt, new Date()))
    .returning({ id: passwordResetTokens.id });

  return result.length;
}
