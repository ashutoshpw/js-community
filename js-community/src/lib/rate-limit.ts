/**
 * Persistent rate limiting utilities for password reset requests.
 *
 * Uses PostgreSQL in production/serverless environments and falls back to
 * in-memory state for tests or local environments without a configured database.
 */

import { and, eq, isNull, lt, or } from "drizzle-orm";
import { passwordResetRateLimits } from "@/db/schema";

interface RateLimitEntry {
  attempts: number;
  blockedUntil: number | null;
  lastAttempt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 60 * 60 * 1000;
let hasLoggedProductionFallbackWarning = false;

function useMemoryFallback(): boolean {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  if (!process.env.DATABASE_URL) {
    if (
      process.env.NODE_ENV === "production" &&
      !hasLoggedProductionFallbackWarning
    ) {
      hasLoggedProductionFallbackWarning = true;
      console.warn(
        "DATABASE_URL is not configured; password reset rate limiting is using in-memory fallback.",
      );
    }

    return true;
  }

  return false;
}

async function getDatabase() {
  const { db } = await import("@/lib/database");
  return db;
}

function checkMemoryRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
} {
  const entry = memoryStore.get(identifier);
  const now = Date.now();

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: new Date(entry.blockedUntil),
    };
  }

  if (now - entry.lastAttempt > WINDOW_MS) {
    memoryStore.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    memoryStore.set(identifier, {
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

function recordMemoryAttempt(identifier: string): void {
  const entry = memoryStore.get(identifier);
  const now = Date.now();

  if (!entry || now - entry.lastAttempt > WINDOW_MS) {
    memoryStore.set(identifier, {
      attempts: 1,
      blockedUntil: null,
      lastAttempt: now,
    });
    return;
  }

  memoryStore.set(identifier, {
    attempts: entry.attempts + 1,
    blockedUntil: entry.blockedUntil,
    lastAttempt: now,
  });
}

export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
}> {
  if (useMemoryFallback()) {
    return checkMemoryRateLimit(identifier);
  }

  const db = await getDatabase();
  const [entry] = await db
    .select()
    .from(passwordResetRateLimits)
    .where(eq(passwordResetRateLimits.identifier, identifier))
    .limit(1);

  const now = new Date();

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: entry.blockedUntil,
    };
  }

  if (now.getTime() - entry.lastAttemptAt.getTime() > WINDOW_MS) {
    await db
      .delete(passwordResetRateLimits)
      .where(eq(passwordResetRateLimits.identifier, identifier));
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);

    await db
      .update(passwordResetRateLimits)
      .set({
        blockedUntil,
        updatedAt: now,
      })
      .where(eq(passwordResetRateLimits.identifier, identifier));

    return {
      allowed: false,
      blockedUntil,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.attempts - 1,
  };
}

export async function recordAttempt(identifier: string): Promise<void> {
  if (useMemoryFallback()) {
    recordMemoryAttempt(identifier);
    return;
  }

  const db = await getDatabase();
  const [entry] = await db
    .select()
    .from(passwordResetRateLimits)
    .where(eq(passwordResetRateLimits.identifier, identifier))
    .limit(1);

  const now = new Date();

  if (!entry || now.getTime() - entry.lastAttemptAt.getTime() > WINDOW_MS) {
    await db
      .insert(passwordResetRateLimits)
      .values({
        identifier,
        attempts: 1,
        blockedUntil: null,
        lastAttemptAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: passwordResetRateLimits.identifier,
        set: {
          attempts: 1,
          blockedUntil: null,
          lastAttemptAt: now,
          updatedAt: now,
        },
      });
    return;
  }

  await db
    .update(passwordResetRateLimits)
    .set({
      attempts: entry.attempts + 1,
      lastAttemptAt: now,
      updatedAt: now,
    })
    .where(eq(passwordResetRateLimits.identifier, identifier));
}

export async function clearRateLimit(identifier: string): Promise<void> {
  if (useMemoryFallback()) {
    memoryStore.delete(identifier);
    return;
  }

  const db = await getDatabase();
  await db
    .delete(passwordResetRateLimits)
    .where(eq(passwordResetRateLimits.identifier, identifier));
}

export async function cleanupRateLimitStore(): Promise<number> {
  if (useMemoryFallback()) {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of memoryStore.entries()) {
      if (!entry.blockedUntil && now - entry.lastAttempt > WINDOW_MS) {
        memoryStore.delete(key);
        cleaned++;
      } else if (entry.blockedUntil && now > entry.blockedUntil) {
        memoryStore.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  const now = new Date();
  const expiredWindow = new Date(now.getTime() - WINDOW_MS);
  const db = await getDatabase();

  const deleted = await db
    .delete(passwordResetRateLimits)
    .where(
      or(
        and(
          isNull(passwordResetRateLimits.blockedUntil),
          lt(passwordResetRateLimits.lastAttemptAt, expiredWindow),
        ),
        lt(passwordResetRateLimits.blockedUntil, now),
      ),
    )
    .returning({ id: passwordResetRateLimits.id });

  return deleted.length;
}
