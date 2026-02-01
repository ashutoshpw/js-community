/**
 * useTypingIndicator hook for showing who is typing
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getChannelName, type TypingEvent } from "@/lib/realtime/types";
import { useRealtimeEvent } from "./useRealtime";

interface TypingUser {
  userId: number;
  username: string;
}

interface UseTypingIndicatorOptions {
  topicId: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseTypingIndicatorReturn {
  typingUsers: TypingUser[];
  sendTyping: () => void;
  stopTyping: () => void;
}

export function useTypingIndicator({
  topicId,
  enabled = true,
  debounceMs = 2000,
}: UseTypingIndicatorOptions): UseTypingIndicatorReturn {
  const { data: session } = useSession();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const lastTypingRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const channel = getChannelName("topic", topicId);

  const sendTypingRequest = useCallback(
    async (action: "start" | "stop") => {
      if (!session?.user) return;

      try {
        await fetch("/api/forum/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, action }),
        });
      } catch (error) {
        console.error("Error sending typing indicator:", error);
      }
    },
    [topicId, session?.user],
  );

  const sendTyping = useCallback(() => {
    if (!enabled || !session?.user) return;

    const now = Date.now();
    if (now - lastTypingRef.current < debounceMs) return;

    lastTypingRef.current = now;
    sendTypingRequest("start");

    // Auto-stop after 5 seconds of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      sendTypingRequest("stop");
    }, 5000);
  }, [enabled, session?.user, debounceMs, sendTypingRequest]);

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    sendTypingRequest("stop");
  }, [sendTypingRequest]);

  // Handle typing events
  const handleTypingStart = useCallback(
    (data: TypingEvent) => {
      // Don't show self
      if (data.userId === userId) return;

      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId)) {
          return prev;
        }
        return [...prev, { userId: data.userId, username: data.username }];
      });
    },
    [userId],
  );

  const handleTypingStop = useCallback((data: TypingEvent) => {
    setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
  }, []);

  useRealtimeEvent<TypingEvent>(
    [channel],
    "typing:start",
    handleTypingStart,
    enabled,
  );
  useRealtimeEvent<TypingEvent>(
    [channel],
    "typing:stop",
    handleTypingStop,
    enabled,
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    typingUsers,
    sendTyping,
    stopTyping,
  };
}

/**
 * Format typing users message
 */
export function formatTypingMessage(users: TypingUser[]): string | null {
  if (users.length === 0) return null;
  if (users.length === 1) return `${users[0].username} is typing...`;
  if (users.length === 2) {
    return `${users[0].username} and ${users[1].username} are typing...`;
  }
  return `${users[0].username} and ${users.length - 1} others are typing...`;
}
