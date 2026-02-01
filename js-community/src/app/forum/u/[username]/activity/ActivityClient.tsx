/**
 * ActivityClient component
 *
 * Client-side user activity stream display.
 */

"use client";

import {
  ArrowLeft,
  FileText,
  Filter,
  Heart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/app/components/forum/EmptyState";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { Pagination } from "@/app/components/forum/Pagination";
import { RelativeTime } from "@/app/components/forum/RelativeTime";

interface Activity {
  type: string;
  id: number;
  topicId: number;
  topicTitle: string;
  topicSlug: string | null;
  postNumber: number | null;
  excerpt: string;
  createdAt: string;
  categoryName: string | null;
  categoryColor: string | null;
}

interface ActivityClientProps {
  username: string;
  initialFilter: string;
}

const FILTERS = [
  { id: "all", label: "All Activity" },
  { id: "topics", label: "Topics" },
  { id: "replies", label: "Replies" },
  { id: "likes", label: "Likes Given" },
];

const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  topic: FileText,
  reply: MessageSquare,
  like: Heart,
};

const ACTIVITY_LABELS: Record<string, string> = {
  topic: "Created a topic",
  reply: "Replied to",
  like: "Liked",
};

const ITEMS_PER_PAGE = 20;

export function ActivityClient({
  username,
  initialFilter,
}: ActivityClientProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState(initialFilter);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `/api/forum/users/${username}/activity?limit=${ITEMS_PER_PAGE}&offset=${offset}&filter=${filter}`,
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    } finally {
      setIsLoading(false);
    }
  }, [username, currentPage, filter]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
    router.push(`/forum/u/${username}/activity?filter=${newFilter}`, {
      scroll: false,
    });
  };

  const totalPages =
    Math.ceil(activities.length / ITEMS_PER_PAGE) + (hasMore ? 1 : 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/forum/u/${username}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Activity
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Recent activity from @{username}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => handleFilterChange(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No activity found"
          description={
            filter === "all"
              ? "This user hasn't had any activity yet."
              : `No ${filter} activity found.`
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type] || FileText;
              const label = ACTIVITY_LABELS[activity.type] || "Activity on";

              return (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        activity.type === "topic"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : activity.type === "reply"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {label}
                      </p>
                      <Link
                        href={`/forum/t/${activity.topicId}/${activity.topicSlug || "topic"}${
                          activity.postNumber && activity.postNumber > 1
                            ? `#post-${activity.postNumber}`
                            : ""
                        }`}
                        className="mt-1 block font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {activity.topicTitle}
                      </Link>
                      {activity.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {activity.excerpt}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {activity.categoryName && (
                          <span
                            className="rounded px-1.5 py-0.5"
                            style={{
                              backgroundColor: activity.categoryColor
                                ? `${activity.categoryColor}20`
                                : undefined,
                              color: activity.categoryColor || undefined,
                            }}
                          >
                            {activity.categoryName}
                          </span>
                        )}
                        <RelativeTime date={activity.createdAt} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
