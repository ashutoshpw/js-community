/**
 * Next.js Instrumentation
 *
 * This file runs at server startup before any requests are handled.
 * Used for environment validation and other initialization tasks.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run validation on the server (not edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertEnv } = await import("@/lib/env");
    assertEnv();
  }
}
