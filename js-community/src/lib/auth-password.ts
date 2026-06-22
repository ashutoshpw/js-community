/**
 * Password update utilities for credential accounts (better-auth compatible).
 */

import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { accounts } from "@/db/schema";
import { db } from "@/lib/database";

/**
 * Update a user's password hash on their credential account row.
 */
export async function updateUserPassword(
  userId: number,
  password: string,
): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  const now = new Date();

  const credentialAccount = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(
      and(eq(accounts.userId, userId), eq(accounts.providerId, "credential")),
    )
    .limit(1);

  if (credentialAccount.length > 0) {
    await db
      .update(accounts)
      .set({ password: hashedPassword, updatedAt: now })
      .where(eq(accounts.id, credentialAccount[0].id));
    return true;
  }

  const emailAccount = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.providerId, "email")))
    .limit(1);

  if (emailAccount.length > 0) {
    await db
      .update(accounts)
      .set({ password: hashedPassword, updatedAt: now })
      .where(eq(accounts.id, emailAccount[0].id));
    return true;
  }

  await db.insert(accounts).values({
    id: crypto.randomUUID(),
    userId,
    accountId: String(userId),
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  return true;
}
