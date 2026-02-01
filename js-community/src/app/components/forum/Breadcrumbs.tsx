/**
 * Breadcrumbs component
 *
 * Displays the navigation path for the current page.
 */

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center gap-1">
        {/* Home link */}
        <li>
          <Link
            href="/forum"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Forum Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
