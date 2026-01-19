/**
 * Better-auth API route handler
 *
 * This file handles all authentication-related API requests
 * including sign-in, sign-up, OAuth callbacks, and session management.
 */

import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Handle GET requests for authentication
 * Used for OAuth callbacks and session retrieval
 */
export async function GET(request: NextRequest) {
  return auth.handler(request);
}

/**
 * Handle POST requests for authentication
 * Used for sign-in, sign-up, sign-out, and token refresh
 */
export async function POST(request: NextRequest) {
  return auth.handler(request);
}
