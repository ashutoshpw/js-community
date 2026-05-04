/**
 * Postgres-backed query cache
 *
 * A simple get-or-set cache that uses the `query_cache` table as its store.
 * This avoids the need for Redis while still reducing repetitive DB reads
 * for expensive or frequently-accessed queries.
 *
 * Usage:
 *   const categories = await getCached(
 *     "forum:categories",
 *     300, // TTL in seconds
 *     () => db.select().from(schema.categories),
 *   );
 */

import { and, eq, gt, lt } from "drizzle-orm";
import { queryCache } from "@/db/schema";

async function getDatabase() {
  const { db } = await import("@/lib/database");
  return db;
}

/**
 * Get a cached value, or compute and store it if missing/expired.
 *
 * @param key        Cache key — use a consistent naming convention, e.g. "forum:categories"
 * @param ttlSeconds Time-to-live in seconds
 * @param fetcher    Async function that computes the value when the cache is cold
 */
export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  // In test or build environments, skip the cache layer entirely
  if (process.env.NODE_ENV === "test" || !process.env.DATABASE_URL) {
    return fetcher();
  }

  const db = await getDatabase();
  const now = new Date();

  // Try to read a valid (non-expired) cache entry
  const [existing] = await db
    .select({ value: queryCache.value })
    .from(queryCache)
    .where(and(eq(queryCache.key, key), gt(queryCache.expiresAt, now)))
    .limit(1);

  if (existing) {
    return JSON.parse(existing.value) as T;
  }

  // Cache miss — compute the value
  const result = await fetcher();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

  // Upsert the computed value
  await db
    .insert(queryCache)
    .values({
      key,
      value: JSON.stringify(result),
      expiresAt,
    })
    .onConflictDoUpdate({
      target: queryCache.key,
      set: {
        value: JSON.stringify(result),
        expiresAt,
        createdAt: now,
      },
    });

  return result;
}

/**
 * Invalidate a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  const db = await getDatabase();
  await db.delete(queryCache).where(eq(queryCache.key, key));
}

/**
 * Invalidate all cache keys that start with a given prefix.
 * Uses a LIKE query — avoid overly broad prefixes.
 */
export async function invalidateCachePrefix(prefix: string): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  const db = await getDatabase();
  const { sql } = await import("drizzle-orm");
  await db
    .delete(queryCache)
    .where(sql`${queryCache.key} LIKE ${prefix + "%"}`);
}

/**
 * Remove all expired cache entries.
 * Called by the Inngest cleanup-cache scheduled function.
 */
export async function cleanupExpiredCache(): Promise<number> {
  if (!process.env.DATABASE_URL) return 0;
  const db = await getDatabase();
  const now = new Date();
  const deleted = await db
    .delete(queryCache)
    .where(lt(queryCache.expiresAt, now))
    .returning({ key: queryCache.key });
  return deleted.length;
}
