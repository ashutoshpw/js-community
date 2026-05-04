/**
 * Inngest function: cleanup-cache
 *
 * Runs hourly and removes expired rows from the query_cache table
 * to keep the table size bounded.
 */

import { inngest } from "@/lib/inngest";
import { cleanupExpiredCache } from "@/lib/cache";

export const cleanupCache = inngest.createFunction(
  {
    id: "cleanup-cache",
    name: "Cleanup Expired Query Cache",
    triggers: [{ cron: "30 * * * *" }], // every hour at :30
  },
  async ({ logger }) => {
    const cleaned = await cleanupExpiredCache();
    logger.info(`Cleaned up ${cleaned} expired cache entries`);
    return { cleaned };
  },
);
