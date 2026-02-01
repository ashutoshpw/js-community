/**
 * PostStream component
 *
 * Container for displaying a stream of posts in a topic.
 * Handles pagination and loading states.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Post } from "./Post";
import { LoadingSpinner } from "./LoadingSpinner";
import { Pagination } from "./Pagination";

interface PostData {
  id: number;
  postNumber: number;
  raw: string;
  cooked: string;
  replyToPostNumber?: number | null;
  replyCount: number;
  likeCount: number;
  reads: number;
  hidden: boolean;
  wiki: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    name?: string | null;
    admin?: boolean;
    moderator?: boolean;
    trustLevel?: number;
    avatarUrl?: string | null;
  };
  currentUserActions?: {
    liked: boolean;
    bookmarked: boolean;
  };
}

interface PostStreamProps {
  topicId: number;
  topicClosed?: boolean;
  initialPosts?: PostData[];
  initialPagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onReply?: (postNumber: number) => void;
}

export function PostStream({
  topicId,
  topicClosed = false,
  initialPosts,
  initialPagination,
  onReply,
}: PostStreamProps) {
  const [posts, setPosts] = useState<PostData[]>(initialPosts || []);
  const [pagination, setPagination] = useState(
    initialPagination || {
      page: 1,
      perPage: 20,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    }
  );
  const [isLoading, setIsLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/forum/topics/${topicId}/posts?page=${page}&per_page=20`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);

        // Scroll to top of post stream
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    },
    [topicId]
  );

  useEffect(() => {
    if (!initialPosts) {
      fetchPosts(1);
    }
  }, [fetchPosts, initialPosts]);

  const handlePageChange = (page: number) => {
    fetchPosts(page);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => fetchPosts(pagination.page)}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        No posts in this topic yet.
      </div>
    );
  }

  return (
    <div className={isLoading ? "pointer-events-none opacity-50" : ""}>
      {/* Posts */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800">
        {posts.map((post, index) => (
          <Post
            key={post.id}
            post={post}
            topicId={topicId}
            topicClosed={topicClosed}
            isFirstPost={index === 0 && pagination.page === 1}
            onReply={onReply}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 border-t border-gray-100 pt-6 dark:border-zinc-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
