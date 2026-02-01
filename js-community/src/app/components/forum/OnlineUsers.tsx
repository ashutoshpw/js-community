/**
 * OnlineUsers component
 *
 * Shows users currently viewing a topic or category
 */

"use client";

import { Users } from "lucide-react";
import { usePresence } from "@/app/hooks/usePresence";

interface OnlineUsersProps {
  channel: string;
  showCount?: boolean;
  showNames?: boolean;
  maxVisible?: number;
}

export function OnlineUsers({
  channel,
  showCount = true,
  showNames = false,
  maxVisible = 5,
}: OnlineUsersProps) {
  const { users, count, isConnected } = usePresence({ channel });

  if (!isConnected || count === 0) {
    return null;
  }

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = count - maxVisible;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Users className="h-4 w-4" />
      {showCount && <span>{count} online</span>}
      {showNames && visibleUsers.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="hidden sm:inline">:</span>
          {visibleUsers.map((user, i) => (
            <span key={user.userId}>
              {user.username}
              {i < visibleUsers.length - 1 && ", "}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-gray-400">+{remainingCount} more</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact online indicator (just a dot with count)
 */
export function OnlineIndicator({ channel }: { channel: string }) {
  const { count, isConnected } = usePresence({ channel });

  if (!isConnected) {
    return (
      <span className="flex items-center gap-1 text-xs text-gray-400">
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span>Offline</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
      <span>{count} online</span>
    </span>
  );
}
