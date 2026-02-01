/**
 * NotificationBell component
 *
 * Displays the notification icon with unread count badge.
 * Placeholder for Phase 4 (real-time notifications).
 */

"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationBellProps {
  unreadCount?: number;
}

export function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
  return (
    <Link
      href="/forum/notifications"
      className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
