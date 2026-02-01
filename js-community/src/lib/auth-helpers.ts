/**
 * Auth Helpers
 *
 * Helper functions for checking user permissions and roles.
 */

import { db } from "@/lib/database";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if a user is an admin by looking up their record in the database
 */
export async function isUserAdmin(userId: string | number): Promise<boolean> {
  const id = typeof userId === "string" ? Number(userId) : userId;

  const [user] = await db
    .select({ admin: schema.users.admin })
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);

  return user?.admin === true;
}

/**
 * Check if a user is a moderator
 */
export async function isUserModerator(
  userId: string | number
): Promise<boolean> {
  const id = typeof userId === "string" ? Number(userId) : userId;

  const [user] = await db
    .select({ admin: schema.users.admin, moderator: schema.users.moderator })
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);

  // Admins are also moderators
  return user?.admin === true || user?.moderator === true;
}

/**
 * Check if a user has staff privileges (admin or moderator)
 */
export async function isUserStaff(userId: string | number): Promise<boolean> {
  return isUserModerator(userId);
}
