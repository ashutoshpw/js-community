/**
 * SearchBar component
 *
 * Expandable search input for the forum header.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/forum/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
    }
  };

  const handleClose = useCallback(() => {
    setQuery("");
    setIsExpanded(false);
  }, []);

  // Keyboard shortcut: Escape to close
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
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-40 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white sm:w-64"
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
  );
}
