/**
 * Forum user helpers for API routes (session → DB user + permissions).
 */

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import type { User as AuthUser, Session } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  hasPermission,
  type Permission,
  type TrustLevel,
} from "@/lib/permissions/trust-levels";

type AuthSession = {
  session: Session;
  user: AuthUser;
};

export interface ForumUser {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  trustLevel: TrustLevel;
  admin: boolean;
  moderator: boolean;
}

export async function getForumUserByEmail(
  email: string,
): Promise<ForumUser | null> {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      trustLevel: users.trustLevel,
      admin: users.admin,
      moderator: users.moderator,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return {
    ...result[0],
    trustLevel: Number(result[0].trustLevel) as TrustLevel,
  };
}

export async function getForumUserFromSession(
  session: AuthSession | null,
): Promise<ForumUser | null> {
  if (!session?.user?.email) {
    return null;
  }
  return getForumUserByEmail(session.user.email);
}

export function userHasPermission(
  user: ForumUser,
  permission: Permission,
): boolean {
  return hasPermission(
    user.trustLevel as TrustLevel,
    permission,
    user.admin,
    user.moderator,
  );
}

export async function requireForumUser(
  session: AuthSession | null,
): Promise<ForumUser | NextResponse> {
  const user = await getForumUserFromSession(session);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}

export async function requireForumPermission(
  session: AuthSession | null,
  permission: Permission,
): Promise<ForumUser | NextResponse> {
  const userOrResponse = await requireForumUser(session);
  if (userOrResponse instanceof NextResponse) {
    return userOrResponse;
  }

  if (!userHasPermission(userOrResponse, permission)) {
    return NextResponse.json(
      {
        error: `You do not have permission to perform this action (${permission})`,
      },
      { status: 403 },
    );
  }

  return userOrResponse;
}
