/**
 * SearchBar component
 *
 * Expandable search input with autocomplete for the forum header.
 */

"use client";

import { FileText, Loader2, MessageSquare, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchResult {
  type: "topic" | "post";
  id: number;
  topicId: number;
  title: string;
  excerpt: string;
  username: string;
  categoryName: string | null;
  categoryColor: string | null;
  postNumber?: number;
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const searchHandler = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/forum/search?q=${encodeURIComponent(searchQuery)}&limit=5`,
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchHandler(value);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/forum/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setIsExpanded(false);
  }, []);

  const handleResultClick = () => {
    handleClose();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
        if (!query) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        handleClose();
      }
      // Ctrl/Cmd + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsExpanded(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, handleClose]);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 ${className}`}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-zinc-700 dark:text-gray-400 sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search topics and posts..."
            className="w-48 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white sm:w-72"
          />
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Autocomplete Results */}
      {showResults && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <ul className="max-h-96 overflow-y-auto">
            {results.map((result) => (
              <li key={`${result.type}-${result.id}`}>
                <Link
                  href={
                    result.type === "topic"
                      ? `/forum/t/${result.topicId}/topic`
                      : `/forum/t/${result.topicId}/topic#post-${result.postNumber}`
                  }
                  onClick={handleResultClick}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  <div className="mt-0.5 rounded bg-gray-100 p-1.5 dark:bg-zinc-700">
                    {result.type === "topic" ? (
                      <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                      {result.excerpt}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      {result.categoryName && (
                        <span
                          className="rounded px-1.5 py-0.5"
                          style={{
                            backgroundColor: result.categoryColor
                              ? `${result.categoryColor}20`
                              : undefined,
                            color: result.categoryColor || undefined,
                          }}
                        >
                          {result.categoryName}
                        </span>
                      )}
                      <span>by {result.username}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-4 py-2 dark:border-zinc-700">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {showResults &&
        query.length >= 2 &&
        results.length === 0 &&
        !isLoading && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white px-4 py-6 text-center shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Try advanced search
            </button>
          </div>
        )}
    </div>
  );
}
