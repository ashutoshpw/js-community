/**
 * Next.js Edge Middleware
 *
 * Responsibilities:
 * 1. Rate-limit API routes (100 req / 60 s per IP by default)
 * 2. Block requests that exceed the limit with a 429 response
 *
 * The counter runs entirely in-memory inside the Edge runtime.
 * Each Edge replica maintains its own counter, so the effective limit
 * across N replicas is N × LIMIT. For strict global limits, swap this
 * out for Vercel KV or an Upstash Redis adapter.
 */

import { type NextRequest, NextResponse } from "next/server";

// --- Configuration -------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window per IP

// Routes that require more aggressive limits (e.g. auth endpoints)
const STRICT_ROUTES = ["/api/auth/sign-in", "/api/auth/sign-up", "/api/contact"];
const STRICT_RATE_LIMIT_MAX = 10;

// Routes excluded from rate-limiting entirely
const EXCLUDED_PREFIXES = ["/api/health", "/api/inngest"];

// --- In-memory store (per Edge replica) ----------------------------------

interface WindowEntry {
  count: number;
  resetAt: number;
}

// Use a Map instead of a plain object so it's GC-friendly
const store = new Map<string, WindowEntry>();

function isAllowed(key: string, max: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count += 1;
  return true;
}

// --- Middleware -----------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only rate-limit API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip excluded routes
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Derive client identifier — prefer CF-Connecting-IP header on Vercel
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const isStrict = STRICT_ROUTES.some((r) => pathname.startsWith(r));
  const max = isStrict ? STRICT_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
  const key = `${ip}:${isStrict ? pathname : "/api"}`;

  if (!isAllowed(key, max)) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
          "X-RateLimit-Limit": String(max),
          "X-RateLimit-Window": `${RATE_LIMIT_WINDOW_MS / 1000}s`,
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
