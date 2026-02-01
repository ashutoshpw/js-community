/**
 * TopicList component
 *
 * Container for displaying a list of topics.
 */

import { TopicRow } from "./TopicRow";
import { NoTopicsFound } from "./EmptyState";
import { Pagination } from "./Pagination";

interface Topic {
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
}

interface TopicListProps {
  topics: Topic[];
  pagination?: {
    page: number;
    totalPages: number;
  };
  baseUrl?: string;
  emptyMessage?: string;
}

export function TopicList({
  topics,
  pagination,
  baseUrl = "/forum/latest",
  emptyMessage,
}: TopicListProps) {
  if (topics.length === 0) {
    return <NoTopicsFound />;
  }

  return (
    <div>
      <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}
