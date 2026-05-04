/**
 * Inngest function: cleanup-rate-limits
 *
 * Runs every hour and removes stale password-reset rate-limit rows
 * from the database so the table does not grow unboundedly.
 */

import { inngest } from "@/lib/inngest";
import { cleanupRateLimitStore } from "@/lib/rate-limit";

export const cleanupRateLimits = inngest.createFunction(
  {
    id: "cleanup-rate-limits",
    name: "Cleanup Rate Limit Store",
    triggers: [{ cron: "0 * * * *" }], // every hour
  },
  async ({ logger }) => {
    const cleaned = await cleanupRateLimitStore();
    logger.info(`Cleaned up ${cleaned} expired rate-limit entries`);
    return { cleaned };
  },
);
