/**
 * TopicDetailClient component
 *
 * Client-side wrapper for topic detail page with interactive features.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PostStream } from "@/app/components/forum/PostStream";
import { Composer } from "@/app/components/forum/Composer";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";

interface TopicDetailClientProps {
  topic: {
    id: number;
    title: string;
    slug: string;
    closed: boolean;
    archived?: boolean;
  };
  initialPosts: Array<{
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
  }>;
  initialPagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function TopicDetailClient({
  topic,
  initialPosts,
  initialPagination,
}: TopicDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [replyToPost, setReplyToPost] = useState<number | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  const handleReply = useCallback((postNumber: number) => {
    setReplyToPost(postNumber);
    setShowComposer(true);
  }, []);

  const handleNewReply = useCallback(() => {
    setReplyToPost(null);
    setShowComposer(true);
  }, []);

  const handleCloseComposer = useCallback(() => {
    setShowComposer(false);
    setReplyToPost(null);
  }, []);

  const handleSubmitReply = async (data: {
    content: string;
    replyToPostNumber?: number | null;
  }) => {
    const response = await fetch(`/api/forum/topics/${topic.id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: data.content,
        replyToPostNumber: data.replyToPostNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to post reply");
    }

    // Refresh the page to show the new post
    router.refresh();
  };

  const handleReplySuccess = useCallback(() => {
    setShowComposer(false);
    setReplyToPost(null);
    // Scroll to bottom to show new post
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  const canReply = !topic.closed && !topic.archived && !!session?.user;

  return (
    <div>
      {/* Post stream */}
      <PostStream
        topicId={topic.id}
        topicClosed={topic.closed}
        initialPosts={initialPosts}
        initialPagination={initialPagination}
        onReply={handleReply}
      />

      {/* Reply button */}
      {canReply && !showComposer && (
        <div className="mt-6 flex justify-center border-t border-gray-200 pt-6 dark:border-zinc-700">
          <button
            type="button"
            onClick={handleNewReply}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            Reply to this topic
          </button>
        </div>
      )}

      {/* Login prompt for anonymous users */}
      {!session?.user && !topic.closed && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <MessageSquare className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
            Join the conversation
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log in or create an account to reply to this topic.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/forum/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Log in
            </Link>
            <Link
              href="/forum/register"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}

      {/* Closed topic notice */}
      {topic.closed && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            This topic has been closed and is no longer accepting replies.
          </p>
        </div>
      )}

      {/* Reply Composer */}
      {showComposer && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="mx-auto max-w-4xl">
            <Composer
              mode="reply"
              topicId={topic.id}
              replyToPostNumber={replyToPost}
              onSubmit={handleSubmitReply}
              onCancel={handleCloseComposer}
              onSuccess={handleReplySuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
