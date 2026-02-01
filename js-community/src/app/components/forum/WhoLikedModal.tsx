/**
 * WhoLikedModal component
 *
 * Modal showing users who liked a post.
 */

"use client";

import { Heart, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { RelativeTime } from "./RelativeTime";
import { UserAvatar } from "./UserAvatar";

interface LikeUser {
  id: number;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  likedAt: string;
}

interface WhoLikedModalProps {
  postId: number;
  likeCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WhoLikedModal({
  postId,
  likeCount,
  isOpen,
  onClose,
}: WhoLikedModalProps) {
  const [users, setUsers] = useState<LikeUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchLikes = useCallback(
    async (loadMore = false) => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const currentOffset = loadMore ? offset : 0;
        const response = await fetch(
          `/api/forum/posts/${postId}/likes?limit=20&offset=${currentOffset}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (loadMore) {
            setUsers((prev) => [...prev, ...data.users]);
          } else {
            setUsers(data.users);
          }
          setHasMore(data.hasMore);
          setOffset(currentOffset + data.users.length);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isOpen, postId, offset],
  );

  useEffect(() => {
    if (isOpen) {
      setOffset(0);
      setUsers([]);
      // Fetch with reset offset
      const doFetch = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/forum/posts/${postId}/likes?limit=20&offset=0`,
          );

          if (response.ok) {
            const data = await response.json();
            setUsers(data.users);
            setHasMore(data.hasMore);
            setOffset(data.users.length);
          }
        } catch (error) {
          console.error("Failed to fetch likes:", error);
        } finally {
          setIsLoading(false);
        }
      };
      doFetch();
    }
  }, [isOpen, postId]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative max-h-[80vh] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && users.length === 0 ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No likes yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
              {users.map((user) => (
                <li key={user.id}>
                  <Link
                    href={`/forum/u/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700"
                  >
                    <UserAvatar
                      user={{
                        username: user.username,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                      }}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name || user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      <RelativeTime date={user.likedAt} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Load more */}
          {hasMore && !isLoading && (
            <div className="border-t border-gray-100 px-4 py-3 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => fetchLikes(true)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Load more
              </button>
            </div>
          )}

          {isLoading && users.length > 0 && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
