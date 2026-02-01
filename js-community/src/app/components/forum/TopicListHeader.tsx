/**
 * TopicListHeader component
 *
 * Sorting tabs for topic lists.
 */

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Clock, TrendingUp, Sparkles } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface TopicListHeaderProps {
  baseUrl?: string;
  currentSort?: string;
}

export function TopicListHeader({
  baseUrl = "/forum",
  currentSort,
}: TopicListHeaderProps) {
  const pathname = usePathname();

  // Determine current sort from pathname if not provided
  const activeSort =
    currentSort ||
    (pathname.includes("/top")
      ? "top"
      : pathname.includes("/new")
        ? "new"
        : "latest");

  const sortOptions: SortOption[] = [
    {
      value: "latest",
      label: "Latest",
      icon: Clock,
      href: `${baseUrl}/latest`,
    },
    {
      value: "top",
      label: "Top",
      icon: TrendingUp,
      href: `${baseUrl}/top`,
    },
    {
      value: "new",
      label: "New",
      icon: Sparkles,
      href: `${baseUrl}/new`,
    },
  ];

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-700">
      <nav className="flex">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.value;
          return (
            <Link
              key={option.value}
              href={option.href}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
