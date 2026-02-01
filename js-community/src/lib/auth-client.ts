/**
 * Better-auth React client
 *
 * This module provides React hooks and functions for client-side authentication.
 * Used in client components for session management and auth actions.
 */

import { createAuthClient } from "better-auth/react";

/**
 * Create the auth client with the app's base URL
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Export commonly used auth functions and hooks
 */
export const { useSession, signIn, signUp, signOut, getSession } = authClient;

/**
 * Type exports for use in components
 */
export type AuthSession = typeof authClient.$Infer.Session;
