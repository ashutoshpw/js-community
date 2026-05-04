/**
 * Inngest API Route
 *
 * This endpoint is used by Inngest to:
 * - Discover registered functions (GET)
 * - Invoke function runs (POST)
 * - Verify function results (PUT)
 *
 * In production, set INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY.
 * In development, the Inngest dev server at http://localhost:8288
 * connects here automatically.
 */

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { cleanupRateLimits, cleanupExpiredSessions, sendEmail } from "@/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [cleanupRateLimits, cleanupExpiredSessions, sendEmail],
});
