/**
 * Forum Layout
 *
 * Main layout wrapper for all forum pages.
 * Includes header, sidebar, and main content area.
 */

import { Header } from "@/app/components/forum/Header";
import { Sidebar } from "@/app/components/forum/Sidebar";
import { getForumCategories } from "@/lib/forum-data";

export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getForumCategories();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Header categories={categories} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <Sidebar categories={categories} />

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
