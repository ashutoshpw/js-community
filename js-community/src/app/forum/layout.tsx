/**
 * Forum Layout
 *
 * Main layout wrapper for all forum pages.
 * Includes header, sidebar, and main content area.
 */

import { Header } from "@/app/components/forum/Header";
import { Sidebar } from "@/app/components/forum/Sidebar";

// TODO: Fetch categories from database once API is ready
// For now, using placeholder data
const placeholderCategories = [
  { id: 1, name: "General Discussion", slug: "general", color: "#3B82F6" },
  { id: 2, name: "JavaScript", slug: "javascript", color: "#F59E0B" },
  { id: 3, name: "TypeScript", slug: "typescript", color: "#3178C6" },
  { id: 4, name: "React", slug: "react", color: "#61DAFB" },
  { id: 5, name: "Next.js", slug: "nextjs", color: "#000000" },
  { id: 6, name: "Node.js", slug: "nodejs", color: "#339933" },
  { id: 7, name: "Help & Support", slug: "help", color: "#10B981" },
  { id: 8, name: "Show & Tell", slug: "show-tell", color: "#8B5CF6" },
];

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Header categories={placeholderCategories} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <Sidebar categories={placeholderCategories} />

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
