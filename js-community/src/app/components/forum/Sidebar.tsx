/**
 * Sidebar component
 *
 * Forum sidebar with categories, tags, and quick links.
 * Server component that fetches category data.
 */

import { Clock, Folder, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  topicCount?: number;
}

interface SidebarProps {
  categories?: Category[];
  className?: string;
}

// Quick navigation links
const quickLinks = [
  { href: "/forum/latest", label: "Latest", icon: Clock },
  { href: "/forum/top", label: "Top", icon: TrendingUp },
  { href: "/forum/new", label: "New", icon: Sparkles },
  { href: "/forum/categories", label: "All Categories", icon: Folder },
];

export function Sidebar({ categories = [], className = "" }: SidebarProps) {
  return (
    <aside
      className={`hidden w-64 shrink-0 lg:block ${className}`}
      aria-label="Sidebar"
    >
      <div className="sticky top-20 space-y-6">
        {/* Quick Links */}
        <nav>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Browse
          </h3>
          <ul className="space-y-1">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                >
                  <link.icon className="h-4 w-4 text-gray-400" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        {categories.length > 0 && (
          <nav>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/forum/c/${category.slug}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: category.color.startsWith("#")
                            ? category.color
                            : `#${category.color}`,
                        }}
                      />
                      <span className="truncate">{category.name}</span>
                    </div>
                    {typeof category.topicCount === "number" && (
                      <span className="text-xs text-gray-400">
                        {category.topicCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Community Stats (placeholder) */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <Users className="h-4 w-4" />
            Community
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                --
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Topics</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                --
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Members
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
