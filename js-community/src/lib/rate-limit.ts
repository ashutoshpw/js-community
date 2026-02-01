/**
 * Rate limiting utilities for password reset requests
 *
 * This module provides server-side rate limiting to prevent abuse
 * of the password reset functionality.
 */

interface RateLimitEntry {
  attempts: number;
  blockedUntil: number | null;
  lastAttempt: number;
}

/**
 * In-memory rate limit store
 * In production, this should use Redis or a database
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
const MAX_ATTEMPTS = 3; // Max attempts per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if an identifier (email/IP) is rate limited
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
} {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();

  // No previous attempts
  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: new Date(entry.blockedUntil),
    };
  }

  // Reset if window has passed
  if (now - entry.lastAttempt > WINDOW_MS) {
    rateLimitStore.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(identifier, {
      ...entry,
      blockedUntil,
    });
    return {
      allowed: false,
      blockedUntil: new Date(blockedUntil),
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.attempts - 1,
  };
}

/**
 * Record a password reset attempt
 */
export function recordAttempt(identifier: string): void {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();

  if (!entry || now - entry.lastAttempt > WINDOW_MS) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      blockedUntil: null,
      lastAttempt: now,
    });
    return;
  }

  rateLimitStore.set(identifier, {
    attempts: entry.attempts + 1,
    blockedUntil: entry.blockedUntil,
    lastAttempt: now,
  });
}

/**
 * Clear rate limit for an identifier (for testing or admin purposes)
 */
export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clean up old entries periodically
 */
export function cleanupRateLimitStore(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove if not blocked and window has passed
    if (!entry.blockedUntil && now - entry.lastAttempt > WINDOW_MS) {
      rateLimitStore.delete(key);
      cleaned++;
    }
    // Remove if block period has passed
    else if (entry.blockedUntil && now > entry.blockedUntil) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}
