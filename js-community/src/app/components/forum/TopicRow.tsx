/**
 * TopicRow component
 *
 * Displays a single topic in the topic list.
 */

import { Archive, Eye, Heart, Lock, MessageSquare, Pin } from "lucide-react";
import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import { formatTopicDate } from "./RelativeTime";
import { UserAvatar } from "./UserAvatar";

interface TopicRowProps {
  topic: {
    id: number;
    title: string;
    slug: string;
    views: number;
    replyCount: number;
    likeCount: number;
    pinned: boolean;
    pinnedGlobally?: boolean;
    closed: boolean;
    archived?: boolean;
    createdAt: Date | string;
    lastPostedAt: Date | string | null;
    author: {
      id: number;
      username: string;
      name?: string | null;
    };
    category?: {
      id: number;
      name: string;
      slug: string;
      color: string;
    } | null;
  };
}

export function TopicRow({ topic }: TopicRowProps) {
  const lastActivity = topic.lastPostedAt || topic.createdAt;

  return (
    <article className="flex gap-4 border-b border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
      {/* Author avatar */}
      <div className="hidden shrink-0 sm:block">
        <Link href={`/forum/u/${topic.author.username}`}>
          <UserAvatar
            user={{
              username: topic.author.username,
              name: topic.author.name,
            }}
            size="md"
          />
        </Link>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Title row */}
        <div className="mb-1 flex items-start gap-2">
          {/* Status icons */}
          {(topic.pinned || topic.pinnedGlobally) && (
            <Pin className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
          )}
          {topic.closed && (
            <Lock className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
          )}
          {topic.archived && (
            <Archive className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
          )}

          {/* Title */}
          <Link
            href={`/forum/t/${topic.id}/${topic.slug}`}
            className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {topic.title}
          </Link>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {/* Category badge */}
          {topic.category && (
            <CategoryBadge category={topic.category} size="sm" />
          )}

          {/* Author (mobile) */}
          <span className="sm:hidden">
            <Link
              href={`/forum/u/${topic.author.username}`}
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              {topic.author.name || topic.author.username}
            </Link>
          </span>

          {/* Author (desktop) */}
          <span className="hidden sm:inline">
            <Link
              href={`/forum/u/${topic.author.username}`}
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              {topic.author.name || topic.author.username}
            </Link>
          </span>

          <span className="text-gray-300 dark:text-gray-600">·</span>

          {/* Last activity */}
          <span title={new Date(lastActivity).toLocaleString()}>
            {formatTopicDate(lastActivity)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden shrink-0 items-center gap-4 text-sm text-gray-500 dark:text-gray-400 md:flex">
        {/* Replies */}
        <div
          className="flex items-center gap-1"
          title={`${topic.replyCount} replies`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{topic.replyCount}</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1" title={`${topic.views} views`}>
          <Eye className="h-4 w-4" />
          <span>{formatNumber(topic.views)}</span>
        </div>

        {/* Likes */}
        {topic.likeCount > 0 && (
          <div
            className="flex items-center gap-1 text-pink-500"
            title={`${topic.likeCount} likes`}
          >
            <Heart className="h-4 w-4" />
            <span>{topic.likeCount}</span>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Format large numbers with K/M suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
