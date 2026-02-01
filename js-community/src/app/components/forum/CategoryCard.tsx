/**
 * CategoryCard component
 *
 * Displays a category with its description and stats.
 */

import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
    description?: string | null;
    topicCount?: number;
    subcategories?: Array<{
      id: number;
      name: string;
      slug: string;
      color: string;
    }>;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const bgColor = category.color.startsWith("#")
    ? category.color
    : `#${category.color}`;

  return (
    <Link
      href={`/forum/c/${category.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      {/* Header with color bar */}
      <div className="mb-3 flex items-start gap-3">
        <div
          className="mt-1 h-4 w-4 shrink-0 rounded"
          style={{ backgroundColor: bgColor }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      {category.description && (
        <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {category.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{category.topicCount || 0} topics</span>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3 dark:border-zinc-700">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Subcategories
          </p>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <span
                key={sub.id}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
                style={{
                  backgroundColor: `${sub.color.startsWith("#") ? sub.color : `#${sub.color}`}20`,
                  color: sub.color.startsWith("#")
                    ? sub.color
                    : `#${sub.color}`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: sub.color.startsWith("#")
                      ? sub.color
                      : `#${sub.color}`,
                  }}
                />
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}
