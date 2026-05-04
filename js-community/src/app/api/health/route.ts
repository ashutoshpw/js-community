/**
 * Health check endpoint
 *
 * GET /api/health
 *
 * Returns a 200 with basic service status including a database connectivity
 * check. Used by Vercel and uptime monitors to confirm the service is alive.
 */

import { NextResponse } from "next/server";

interface HealthStatus {
  status: "ok" | "degraded";
  timestamp: string;
  version: string;
  checks: {
    database: "ok" | "error";
  };
}

export async function GET() {
  const status: HealthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "unknown",
    checks: {
      database: "ok",
    },
  };

  try {
    // Lightweight DB ping — just check we can connect
    if (process.env.DATABASE_URL) {
      const { db } = await import("@/lib/database");
      const { sql } = await import("drizzle-orm");
      await db.execute(sql`SELECT 1`);
    }
  } catch {
    status.status = "degraded";
    status.checks.database = "error";
  }

  return NextResponse.json(status, {
    status: status.status === "ok" ? 200 : 503,
  });
}
