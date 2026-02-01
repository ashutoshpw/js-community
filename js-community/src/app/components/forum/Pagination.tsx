/**
 * Pagination component
 *
 * Navigation for paginated content.
 * Supports both URL-based navigation (baseUrl) and callback-based navigation (onPageChange).
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BasePaginationProps {
  currentPage: number;
  totalPages: number;
}

interface UrlPaginationProps extends BasePaginationProps {
  baseUrl: string;
  onPageChange?: never;
}

interface CallbackPaginationProps extends BasePaginationProps {
  baseUrl?: never;
  onPageChange: (page: number) => void;
}

export type PaginationProps = UrlPaginationProps | CallbackPaginationProps;

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
}: PaginationProps) {
  const searchParams = useSearchParams();

  // Build URL with page parameter (for URL-based pagination)
  const getPageUrl = (page: number) => {
    if (!baseUrl) return "#";
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Handle page navigation
  const handlePageClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2; // Pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis if there's a gap after first page
    if (rangeStart > 2) {
      pages.push("ellipsis-start");
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  // Render a page link or button
  const PageItem = ({
    page,
    children,
    disabled = false,
    isActive = false,
  }: {
    page: number;
    children: React.ReactNode;
    disabled?: boolean;
    isActive?: boolean;
  }) => {
    const className = disabled
      ? "flex cursor-not-allowed items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600"
      : isActive
        ? "min-w-[2.5rem] rounded-lg px-3 py-2 text-center text-sm font-medium bg-blue-600 text-white"
        : "min-w-[2.5rem] rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800";

    if (disabled) {
      return <span className={className}>{children}</span>;
    }

    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={(e) => handlePageClick(page, e)}
          className={className}
        >
          {children}
        </button>
      );
    }

    return (
      <Link href={getPageUrl(page)} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 py-4"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <PageItem page={currentPage - 1} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </PageItem>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page) =>
          typeof page === "string" ? (
            <span
              key={page}
              className="px-2 text-gray-400 dark:text-gray-500"
            >
              ...
            </span>
          ) : (
            <PageItem key={page} page={page} isActive={page === currentPage}>
              {page}
            </PageItem>
          )
        )}
      </div>

      {/* Next button */}
      <PageItem page={currentPage + 1} disabled={currentPage >= totalPages}>
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </PageItem>
    </nav>
  );
}
