/**
 * Inngest function: cleanup-expired-sessions
 *
 * Runs daily and removes:
 * - Expired better-auth sessions
 * - Used or expired password-reset tokens
 *
 * This keeps the auth tables lean without needing Redis TTL.
 */

import { and, eq, lt, or } from "drizzle-orm";
import { inngest } from "@/lib/inngest";
import { db } from "@/lib/database";
import { sessions, passwordResetTokens } from "@/db/schema";

export const cleanupExpiredSessions = inngest.createFunction(
  {
    id: "cleanup-expired-sessions",
    name: "Cleanup Expired Sessions and Tokens",
    triggers: [{ cron: "0 3 * * *" }], // daily at 03:00 UTC
  },
  async ({ logger }) => {
    const now = new Date();

    // Delete expired sessions
    const deletedSessions = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, now))
      .returning({ id: sessions.id });

    // Delete password-reset tokens that are either used or expired
    const deletedTokens = await db
      .delete(passwordResetTokens)
      .where(
        or(
          eq(passwordResetTokens.used, true),
          lt(passwordResetTokens.expiresAt, now),
        ),
      )
      .returning({ id: passwordResetTokens.id });

    logger.info(
      `Deleted ${deletedSessions.length} expired sessions and ${deletedTokens.length} stale reset tokens`,
    );

    return {
      deletedSessions: deletedSessions.length,
      deletedTokens: deletedTokens.length,
    };
  },
);
