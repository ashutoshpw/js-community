/**
 * TopicHeader component
 *
 * Displays the topic title, metadata, and action buttons.
 */

import {
  Archive,
  Edit,
  Eye,
  Heart,
  Lock,
  MessageSquare,
  Pin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import { formatTopicDate } from "./RelativeTime";

interface TopicHeaderProps {
  topic: {
    id: number;
    title: string;
    slug: string;
    views: number;
    postsCount: number;
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
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TopicHeader({
  topic,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: TopicHeaderProps) {
  return (
    <header className="border-b border-gray-200 pb-6 dark:border-zinc-700">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/forum"
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          Forum
        </Link>
        <span>/</span>
        {topic.category && (
          <>
            <Link
              href={`/forum/c/${topic.category.slug}`}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              {topic.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate text-gray-700 dark:text-gray-200">
          {topic.title}
        </span>
      </nav>

      {/* Title row */}
      <div className="flex flex-wrap items-start gap-3">
        {/* Status icons */}
        <div className="flex shrink-0 items-center gap-2">
          {(topic.pinned || topic.pinnedGlobally) && (
            <span
              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              title={
                topic.pinnedGlobally ? "Pinned globally" : "Pinned in category"
              }
            >
              <Pin className="h-3 w-3" />
              Pinned
            </span>
          )}
          {topic.closed && (
            <span
              className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
              title="This topic is closed"
            >
              <Lock className="h-3 w-3" />
              Closed
            </span>
          )}
          {topic.archived && (
            <span
              className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              title="This topic is archived"
            >
              <Archive className="h-3 w-3" />
              Archived
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="flex-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {topic.title}
        </h1>

        {/* Edit/Delete buttons */}
        {(canEdit || canDelete) && (
          <div className="flex shrink-0 items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
                title="Edit topic"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Delete topic"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {/* Category */}
        {topic.category && <CategoryBadge category={topic.category} />}

        {/* Author */}
        <span>
          Started by{" "}
          <Link
            href={`/forum/u/${topic.author.username}`}
            className="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {topic.author.name || topic.author.username}
          </Link>
        </span>

        {/* Created date */}
        <span title={new Date(topic.createdAt).toLocaleString()}>
          {formatTopicDate(topic.createdAt)}
        </span>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <span
            className="flex items-center gap-1"
            title={`${topic.views} views`}
          >
            <Eye className="h-4 w-4" />
            {formatNumber(topic.views)}
          </span>
          <span
            className="flex items-center gap-1"
            title={`${topic.replyCount} replies`}
          >
            <MessageSquare className="h-4 w-4" />
            {topic.replyCount}
          </span>
          {topic.likeCount > 0 && (
            <span
              className="flex items-center gap-1 text-pink-500"
              title={`${topic.likeCount} likes`}
            >
              <Heart className="h-4 w-4" />
              {topic.likeCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
