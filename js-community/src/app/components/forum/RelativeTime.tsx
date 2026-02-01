/**
 * RelativeTime component
 *
 * Displays a timestamp in relative format (e.g., "2 hours ago").
 * Shows full date on hover.
 */

import { format, formatDistanceToNow } from "date-fns";

interface RelativeTimeProps {
  date: Date | string;
  className?: string;
}

export function RelativeTime({ date, className = "" }: RelativeTimeProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  const fullDate = format(dateObj, "PPpp"); // e.g., "Apr 29, 2023, 1:30 PM"

  return (
    <time
      dateTime={dateObj.toISOString()}
      title={fullDate}
      className={`text-gray-500 dark:text-gray-400 ${className}`}
    >
      {relativeTime}
    </time>
  );
}

/**
 * Format a date for display in topic/post lists
 * Uses relative time for recent dates, absolute for older ones
 */
export function formatTopicDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 1) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  if (diffInDays < 7) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  if (diffInDays < 365) {
    return format(dateObj, "MMM d"); // e.g., "Apr 29"
  }
  return format(dateObj, "MMM d, yyyy"); // e.g., "Apr 29, 2023"
}
