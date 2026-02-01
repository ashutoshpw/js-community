/**
 * Post component
 *
 * Displays a single post with author sidebar, content, and actions.
 */

"use client";

import { useState } from "react";
import { PostActions } from "./PostActions";
import { PostAuthor } from "./PostAuthor";

interface PostProps {
  post: {
    id: number;
    postNumber: number;
    cooked: string;
    replyToPostNumber?: number | null;
    replyCount: number;
    likeCount: number;
    wiki?: boolean;
    version?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
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
  };
  topicId: number;
  topicClosed?: boolean;
  isFirstPost?: boolean;
  onReply?: (postNumber: number) => void;
}

export function Post({
  post,
  topicId,
  topicClosed = false,
  isFirstPost = false,
  onReply,
}: PostProps) {
  const [isExpanded, _setIsExpanded] = useState(true);

  const handleReply = () => {
    onReply?.(post.postNumber);
  };

  return (
    <article
      id={`post-${post.postNumber}`}
      className={`flex gap-4 border-b border-gray-100 py-6 dark:border-zinc-800 ${
        isFirstPost ? "pt-2" : ""
      }`}
    >
      {/* Author sidebar - hidden on mobile */}
      <aside className="hidden w-28 shrink-0 sm:block">
        <PostAuthor
          author={post.author}
          postNumber={post.postNumber}
          createdAt={post.createdAt}
        />
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Mobile author info */}
        <div className="mb-3 flex items-center gap-2 sm:hidden">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                {(post.author.name || post.author.username)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {post.author.name || post.author.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            #{post.postNumber}
          </span>
        </div>

        {/* Reply indicator */}
        {post.replyToPostNumber && (
          <a
            href={`#post-${post.replyToPostNumber}`}
            className="mb-2 inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Reply arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reply to #{post.replyToPostNumber}
          </a>
        )}

        {/* Wiki indicator */}
        {post.wiki && (
          <div className="mb-2 inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Wiki icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Wiki post - anyone can edit
          </div>
        )}

        {/* Post content */}
        {isExpanded && (
          <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none dark:prose-a:text-blue-400 dark:prose-code:bg-zinc-800"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized server-side
            dangerouslySetInnerHTML={{ __html: post.cooked }}
          />
        )}

        {/* Edit indicator */}
        {post.version && post.version > 1 && (
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Edited {new Date(post.updatedAt).toLocaleDateString()} (version{" "}
            {post.version})
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <PostActions
            postId={post.id}
            topicId={topicId}
            postNumber={post.postNumber}
            likeCount={post.likeCount}
            replyCount={post.replyCount}
            liked={post.currentUserActions?.liked ?? false}
            bookmarked={post.currentUserActions?.bookmarked ?? false}
            canReply={!topicClosed}
            onReply={handleReply}
          />
        </div>
      </div>
    </article>
  );
}
