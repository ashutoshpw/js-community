/**
 * User Activity page
 *
 * Displays user activity stream.
 */

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import { ActivityClient } from "./ActivityClient";

interface ActivityPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ filter?: string }>;
}

export async function generateMetadata({ params }: ActivityPageProps) {
  const { username } = await params;
  return {
    title: `${username}'s Activity - JS Community`,
    description: `View ${username}'s activity on JS Community`,
  };
}

export default async function ActivityPage({
  params,
  searchParams,
}: ActivityPageProps) {
  const { username } = await params;
  const { filter } = await searchParams;

  // Verify user exists
  const userResult = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);

  if (userResult.length === 0) {
    notFound();
  }

  return <ActivityClient username={username} initialFilter={filter || "all"} />;
}
