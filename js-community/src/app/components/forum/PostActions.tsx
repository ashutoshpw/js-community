/**
 * PostActions component
 *
 * Action buttons for a post: like, reply, bookmark, share, flag.
 */

"use client";

import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface PostActionsProps {
  postId: number;
  topicId: number;
  postNumber: number;
  likeCount: number;
  replyCount: number;
  liked: boolean;
  bookmarked: boolean;
  canReply?: boolean;
  onReply?: () => void;
}

export function PostActions({
  postId,
  topicId,
  postNumber,
  likeCount,
  replyCount,
  liked: initialLiked,
  bookmarked: initialBookmarked,
  canReply = true,
  onReply,
}: PostActionsProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (!session?.user || isLoading) return;

    setIsLoading(true);
    const wasLiked = liked;

    // Optimistic update
    setLiked(!wasLiked);
    setCurrentLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/forum/posts/${postId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      if (!response.ok) {
        // Revert on error
        setLiked(wasLiked);
        setCurrentLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setCurrentLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!session?.user || isLoading) return;

    setIsLoading(true);
    const wasBookmarked = bookmarked;

    // Optimistic update
    setBookmarked(!wasBookmarked);

    try {
      const response = await fetch(`/api/forum/posts/${postId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bookmark" }),
      });

      if (!response.ok) {
        setBookmarked(wasBookmarked);
      }
    } catch {
      setBookmarked(wasBookmarked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/forum/t/${topicId}#post-${postNumber}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 1500);
  };

  const handleFlag = async () => {
    if (!session?.user) return;
    // For now, just show an alert. In a full implementation, this would open a modal.
    alert("Flag functionality coming soon. Please contact a moderator directly for urgent issues.");
  };

  return (
    <div className="flex items-center gap-1">
      {/* Like button */}
      <button
        type="button"
        onClick={handleLike}
        disabled={!session?.user || isLoading}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
          liked
            ? "text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-900/20"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
        } disabled:cursor-not-allowed disabled:opacity-50`}
        title={session?.user ? (liked ? "Unlike" : "Like") : "Log in to like"}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        {currentLikeCount > 0 && <span>{currentLikeCount}</span>}
      </button>

      {/* Reply button */}
      {canReply && (
        <button
          type="button"
          onClick={onReply}
          disabled={!session?.user}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
          title={session?.user ? "Reply" : "Log in to reply"}
        >
          <MessageSquare className="h-4 w-4" />
          {replyCount > 0 && <span>{replyCount}</span>}
        </button>
      )}

      {/* Bookmark button */}
      <button
        type="button"
        onClick={handleBookmark}
        disabled={!session?.user || isLoading}
        className={`rounded-md p-1.5 transition-colors ${
          bookmarked
            ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
        } disabled:cursor-not-allowed disabled:opacity-50`}
        title={session?.user ? (bookmarked ? "Remove bookmark" : "Bookmark") : "Log in to bookmark"}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </button>

      {/* Share button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {showShareMenu && (
          <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  <span>Copy link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Flag button */}
      {session?.user && (
        <button
          type="button"
          onClick={handleFlag}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-orange-400"
          title="Flag this post"
        >
          <Flag className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
