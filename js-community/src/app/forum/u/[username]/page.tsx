/**
 * User Profile page
 *
 * Displays user information and summary.
 */

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import { ProfileClient } from "./ProfileClient";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  return {
    title: `${username} - JS Community`,
    description: `View ${username}'s profile on JS Community`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Verify user exists
  const userResult = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);

  if (userResult.length === 0) {
    notFound();
  }

  return <ProfileClient username={username} />;
}
