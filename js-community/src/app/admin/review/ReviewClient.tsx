/**
 * Admin Review Queue Client Component
 */

"use client";

import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ReviewableItem {
  id: number;
  type: string;
  status: string;
  targetId: number;
  targetType: string;
  score: number;
  potentialSpam: boolean;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
  } | null;
  target: {
    title?: string;
    content?: string;
    username?: string;
  };
  scoreCount: number;
  topReason: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  ignored: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  post: MessageSquare,
  topic: FileText,
  user: User,
};

export function ReviewClient() {
  const [items, setItems] = useState<ReviewableItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        status: filter,
      });
      const res = await fetch(`/api/admin/review?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching review items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAction = async (
    itemId: number,
    action: "approve" | "reject" | "ignore",
  ) => {
    setActionInProgress(itemId);
    try {
      const res = await fetch(`/api/admin/review/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || "Action failed");
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setActionInProgress(null);
    }
  };

  const getTargetLink = (item: ReviewableItem): string | null => {
    if (item.targetType === "post") {
      return `/forum/topic/${item.targetId}`;
    }
    if (item.targetType === "topic") {
      return `/forum/topic/${item.targetId}`;
    }
    if (item.targetType === "user") {
      return `/forum/user/${item.target.username}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setFilter("pending");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
          }`}
        >
          Pending ({items.filter((i) => i.status === "pending").length || "0"})
        </button>
        <button
          type="button"
          onClick={() => {
            setFilter("all");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
          }`}
        >
          All
        </button>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Check className="mx-auto mb-4 h-12 w-12 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            All clear!
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            No items need review at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = typeIcons[item.targetType] || AlertTriangle;
            const targetLink = getTargetLink(item);

            return (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        item.potentialSpam
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-gray-100 dark:bg-zinc-800"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          item.potentialSpam
                            ? "text-red-600"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusColors[item.status]
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.targetType}
                        </span>
                        {item.potentialSpam && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            Spam
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        {item.target.title && (
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.target.title}
                          </p>
                        )}
                        {item.target.content && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                            {item.target.content}
                          </p>
                        )}
                        {item.target.username && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            User: @{item.target.username}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                        {item.createdBy && (
                          <span>Reported by {item.createdBy.name}</span>
                        )}
                        {item.scoreCount > 1 && (
                          <span className="font-medium text-orange-600">
                            {item.scoreCount} reports
                          </span>
                        )}
                        {item.topReason && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-zinc-800">
                            {item.topReason}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    {targetLink && (
                      <Link
                        href={targetLink}
                        target="_blank"
                        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    {item.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, "approve")}
                          disabled={actionInProgress === item.id}
                          className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, "reject")}
                          disabled={actionInProgress === item.id}
                          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              className="rounded-lg border border-gray-200 p-2 disabled:opacity-50 dark:border-zinc-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-gray-200 p-2 disabled:opacity-50 dark:border-zinc-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
