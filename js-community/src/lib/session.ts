/**
 * Session management utilities for client-side and server-side
 */

import { auth } from "@/lib/auth";

/**
 * Get the current session on the server side
 * Use this in server components and API routes
 */
export async function getServerSession(headers: Headers) {
  try {
    const session = await auth.api.getSession({ headers });
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

/**
 * Get the current session on the client side
 * Use this in client components
 */
export async function getClientSession() {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return null;
    }
    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error getting client session:", error);
    return null;
  }
}

/**
 * Check if a user is authenticated on the server side
 */
export async function isAuthenticated(headers: Headers): Promise<boolean> {
  const session = await getServerSession(headers);
  return !!session?.user;
}

/**
 * Check if a user is authenticated on the client side
 */
export async function isAuthenticatedClient(): Promise<boolean> {
  const session = await getClientSession();
  return !!session?.user;
}
