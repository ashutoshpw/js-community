/**
 * SearchClient component
 *
 * Client-side search with filters and pagination.
 */

"use client";

import {
  ChevronDown,
  FileText,
  Filter,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/app/components/forum/EmptyState";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { Pagination } from "@/app/components/forum/Pagination";
import { RelativeTime } from "@/app/components/forum/RelativeTime";

interface SearchResult {
  type: "topic" | "post";
  id: number;
  topicId: number;
  title: string;
  excerpt: string;
  username: string;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryColor: string | null;
  createdAt: string;
  postNumber?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

interface SearchClientProps {
  initialQuery: string;
  initialType: string;
  initialCategory?: string;
  initialUser?: string;
}

const ITEMS_PER_PAGE = 20;

export function SearchClient({
  initialQuery,
  initialType,
  initialCategory,
  initialUser,
}: SearchClientProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || "");
  const [userFilter, setUserFilter] = useState(initialUser || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/forum/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const performSearch = useCallback(async () => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const params = new URLSearchParams({
        q: query,
        type: searchType,
        limit: String(ITEMS_PER_PAGE),
        offset: String(offset),
      });

      if (categoryFilter) {
        params.set("category", categoryFilter);
      }
      if (userFilter) {
        params.set("user", userFilter);
      }

      const response = await fetch(`/api/forum/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchType, categoryFilter, userFilter, currentPage]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    // Update URL
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchType !== "all") params.set("type", searchType);
    if (categoryFilter) params.set("category", categoryFilter);
    if (userFilter) params.set("user", userFilter);

    router.push(`/forum/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setUserFilter("");
    setSearchType("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = categoryFilter || userFilter || searchType !== "all";
  const totalPages =
    Math.ceil(results.length / ITEMS_PER_PAGE) + (hasMore ? 1 : 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics and posts..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50 sm:grid-cols-3">
            {/* Type Filter */}
            <div>
              <label
                htmlFor="search-type"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Search in
              </label>
              <select
                id="search-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="topics">Topics only</option>
                <option value="posts">Posts only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label
                htmlFor="user-filter"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Posted by
              </label>
              <input
                id="user-filter"
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Username"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : !query || query.length < 2 ? (
        <EmptyState
          icon={Search}
          title="Enter a search term"
          description="Type at least 2 characters to search topics and posts."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title={`No results for "${query}"`}
          description="Try different keywords or adjust your filters."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Found {results.length}
            {hasMore ? "+" : ""} results for &quot;{query}&quot;
          </p>

          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={
                  result.type === "topic"
                    ? `/forum/t/${result.topicId}/topic`
                    : `/forum/t/${result.topicId}/topic#post-${result.postNumber}`
                }
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-gray-100 p-2 dark:bg-zinc-700">
                    {result.type === "topic" ? (
                      <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                      {result.type === "post" && result.postNumber && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Post #{result.postNumber})
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {result.excerpt}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {result.categoryName && (
                        <span
                          className="rounded px-2 py-0.5"
                          style={{
                            backgroundColor: result.categoryColor
                              ? `${result.categoryColor}20`
                              : "rgb(229 231 235)",
                            color: result.categoryColor || "rgb(107 114 128)",
                          }}
                        >
                          {result.categoryName}
                        </span>
                      )}
                      <span>by {result.username}</span>
                      <RelativeTime date={result.createdAt} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
