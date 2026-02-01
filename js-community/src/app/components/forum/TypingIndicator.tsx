/**
 * TypingIndicator component
 *
 * Shows who is currently typing in a topic
 */

"use client";

import {
  formatTypingMessage,
  useTypingIndicator,
} from "@/app/hooks/useTypingIndicator";

interface TypingIndicatorProps {
  topicId: number;
}

export function TypingIndicator({ topicId }: TypingIndicatorProps) {
  const { typingUsers } = useTypingIndicator({ topicId });
  const message = formatTypingMessage(typingUsers);

  if (!message) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      <TypingDots />
      <span>{message}</span>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-0.5">
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}
