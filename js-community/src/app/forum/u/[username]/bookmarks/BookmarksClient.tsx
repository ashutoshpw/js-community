/**
 * BookmarksClient component
 *
 * Client-side bookmarks list with management features.
 */

"use client";

import {
  Bell,
  Bookmark,
  Check,
  Clock,
  Edit2,
  Pin,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/app/components/forum/EmptyState";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { Pagination } from "@/app/components/forum/Pagination";
import { RelativeTime } from "@/app/components/forum/RelativeTime";

interface BookmarkData {
  id: number;
  name: string | null;
  pinned: boolean;
  reminderAt: string | null;
  createdAt: string;
  post: {
    id: number;
    postNumber: number;
    excerpt: string;
    username: string;
  } | null;
  topic: {
    id: number;
    title: string;
    slug: string;
  } | null;
  category: {
    id: number;
    name: string;
    color: string | null;
  } | null;
}

interface BookmarksClientProps {
  username: string;
}

const ITEMS_PER_PAGE = 20;

export function BookmarksClient({ username: _username }: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `/api/forum/bookmarks?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      );
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleDelete = async (bookmarkId: number) => {
    if (!confirm("Are you sure you want to remove this bookmark?")) return;

    try {
      const response = await fetch(`/api/forum/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      }
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleTogglePin = async (
    bookmarkId: number,
    currentlyPinned: boolean,
  ) => {
    try {
      const response = await fetch(`/api/forum/bookmarks/${bookmarkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !currentlyPinned }),
      });

      if (response.ok) {
        setBookmarks((prev) =>
          prev.map((b) =>
            b.id === bookmarkId ? { ...b, pinned: !currentlyPinned } : b,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleSaveName = async (bookmarkId: number) => {
    try {
      const response = await fetch(`/api/forum/bookmarks/${bookmarkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (response.ok) {
        setBookmarks((prev) =>
          prev.map((b) =>
            b.id === bookmarkId ? { ...b, name: editName || null } : b,
          ),
        );
        setEditingId(null);
        setEditName("");
      }
    } catch (error) {
      console.error("Failed to update bookmark name:", error);
    }
  };

  const totalPages =
    Math.ceil(bookmarks.length / ITEMS_PER_PAGE) + (hasMore ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookmarks
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Posts you&apos;ve saved for later
        </p>
      </div>

      {/* Content */}
      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="When you bookmark a post, it will appear here for easy access."
        />
      ) : (
        <>
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className={`rounded-lg border bg-white p-4 transition-colors dark:bg-zinc-800 ${
                  bookmark.pinned
                    ? "border-yellow-300 dark:border-yellow-700"
                    : "border-gray-200 dark:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Bookmark name */}
                    {editingId === bookmark.id ? (
                      <div className="mb-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveName(bookmark.id)}
                          className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          title="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : bookmark.name ? (
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Bookmark className="h-4 w-4" />
                        {bookmark.name}
                      </p>
                    ) : null}

                    {/* Topic title */}
                    {bookmark.topic && (
                      <Link
                        href={`/forum/t/${bookmark.topic.id}/${bookmark.topic.slug}${
                          bookmark.post
                            ? `#post-${bookmark.post.postNumber}`
                            : ""
                        }`}
                        className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {bookmark.topic.title}
                      </Link>
                    )}

                    {/* Post excerpt */}
                    {bookmark.post && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {bookmark.post.excerpt}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {bookmark.pinned && (
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                      {bookmark.category && (
                        <span
                          className="rounded px-1.5 py-0.5"
                          style={{
                            backgroundColor: bookmark.category.color
                              ? `${bookmark.category.color}20`
                              : undefined,
                            color: bookmark.category.color || undefined,
                          }}
                        >
                          {bookmark.category.name}
                        </span>
                      )}
                      {bookmark.post && (
                        <span>by {bookmark.post.username}</span>
                      )}
                      {bookmark.reminderAt && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <Bell className="h-3 w-3" />
                          Reminder set
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Saved <RelativeTime date={bookmark.createdAt} />
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleTogglePin(bookmark.id, bookmark.pinned)
                      }
                      className={`rounded p-1.5 transition-colors ${
                        bookmark.pinned
                          ? "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-500 dark:hover:bg-yellow-900/20"
                          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"
                      }`}
                      title={bookmark.pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(bookmark.id);
                        setEditName(bookmark.name || "");
                      }}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"
                      title="Edit note"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(bookmark.id)}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
