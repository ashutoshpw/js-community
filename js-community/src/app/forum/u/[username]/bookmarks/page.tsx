/**
 * User Bookmarks page
 *
 * Displays the user's bookmarked posts.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BookmarksClient } from "./BookmarksClient";

export const metadata = {
  title: "Bookmarks - JS Community",
  description: "Your bookmarked posts",
};

interface BookmarksPageProps {
  params: Promise<{ username: string }>;
}

export default async function BookmarksPage({ params }: BookmarksPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { username } = await params;

  // Only allow viewing your own bookmarks
  if (!session?.user) {
    redirect(`/forum/login?redirect=/forum/u/${username}/bookmarks`);
  }

  return <BookmarksClient username={username} />;
}
