/**
 * NotificationsClient component
 *
 * Client-side notifications list with filtering and pagination.
 */

"use client";

import {
  AtSign,
  Bell,
  CheckCheck,
  Heart,
  MessageSquare,
  Quote,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/app/components/forum/EmptyState";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { Pagination } from "@/app/components/forum/Pagination";

interface NotificationData {
  display_username?: string;
  topic_title?: string;
  [key: string]: unknown;
}

interface Notification {
  id: number;
  notificationType: number;
  data: NotificationData | null;
  read: boolean;
  topicId: number | null;
  postId: number | null;
  createdAt: string;
}

const NOTIFICATION_TYPES: Record<
  number,
  { icon: typeof Bell; label: string; color: string }
> = {
  1: { icon: AtSign, label: "mentioned you", color: "text-purple-500" },
  2: {
    icon: MessageSquare,
    label: "replied to your post",
    color: "text-blue-500",
  },
  3: { icon: Quote, label: "quoted you", color: "text-green-500" },
  4: { icon: Heart, label: "liked your post", color: "text-pink-500" },
  5: {
    icon: MessageSquare,
    label: "posted in a topic you're watching",
    color: "text-gray-500",
  },
};

const ITEMS_PER_PAGE = 20;

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const url = `/api/forum/notifications?limit=${ITEMS_PER_PAGE}&offset=${offset}${
        filter === "unread" ? "&unread=true" : ""
      }`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setHasMore(data.hasMore);
        setTotalUnread(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch("/api/forum/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setTotalUnread(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / ITEMS_PER_PAGE) + (hasMore ? 1 : 0),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {totalUnread > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {totalUnread} unread notification{totalUnread !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter("unread");
                setCurrentPage(1);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Actions */}
          {totalUnread > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}

          <Link
            href="/forum/notifications/preferences"
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-300"
            title="Notification preferences"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            filter === "unread"
              ? "No unread notifications"
              : "No notifications yet"
          }
          description={
            filter === "unread"
              ? "You're all caught up! Check back later for new updates."
              : "When someone mentions you, replies to your posts, or likes your content, you'll see it here."
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
              {notifications.map((notification) => {
                const typeInfo = NOTIFICATION_TYPES[
                  notification.notificationType
                ] || {
                  icon: Bell,
                  label: "notification",
                  color: "text-gray-500",
                };
                const Icon = typeInfo.icon;

                return (
                  <li key={notification.id}>
                    <Link
                      href={
                        notification.topicId
                          ? `/forum/t/${notification.topicId}${notification.postId ? `#post-${notification.postId}` : ""}`
                          : "#"
                      }
                      className={`flex items-start gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700/50 ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <div
                        className={`mt-0.5 rounded-full p-2 ${
                          !notification.read
                            ? "bg-blue-100 dark:bg-blue-900/50"
                            : "bg-gray-100 dark:bg-zinc-700"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-semibold">
                            {notification.data?.display_username || "Someone"}
                          </span>{" "}
                          {typeInfo.label}
                        </p>
                        {notification.data?.topic_title && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {notification.data.topic_title}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
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
