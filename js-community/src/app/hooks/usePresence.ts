/**
 * usePresence hook for tracking user presence in a channel
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import type { PresenceEvent } from "@/lib/realtime/types";
import { useRealtimeEvent } from "./useRealtime";

interface PresenceUser {
  userId: number;
  username: string;
}

interface UsePresenceOptions {
  channel: string;
  enabled?: boolean;
  heartbeatInterval?: number;
}

interface UsePresenceReturn {
  users: PresenceUser[];
  count: number;
  isConnected: boolean;
}

export function usePresence({
  channel,
  enabled = true,
  heartbeatInterval = 30000,
}: UsePresenceOptions): UsePresenceReturn {
  const { data: session } = useSession();
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const sendPresence = useCallback(
    async (action: "join" | "leave" | "heartbeat") => {
      if (!session?.user) return;

      try {
        await fetch("/api/forum/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, action }),
        });
      } catch (error) {
        console.error("Error sending presence:", error);
      }
    },
    [channel, session?.user],
  );

  const fetchPresence = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/forum/presence?channel=${encodeURIComponent(channel)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching presence:", error);
    }
  }, [channel]);

  // Handle presence events
  const handleJoin = useCallback((data: PresenceEvent) => {
    setUsers((prev) => {
      if (prev.some((u) => u.userId === data.userId)) {
        return prev;
      }
      return [...prev, { userId: data.userId, username: data.username }];
    });
  }, []);

  const handleLeave = useCallback((data: PresenceEvent) => {
    setUsers((prev) => prev.filter((u) => u.userId !== data.userId));
  }, []);

  const { isConnected } = useRealtimeEvent<PresenceEvent>(
    [channel],
    "presence:join",
    handleJoin,
    enabled,
  );

  useRealtimeEvent<PresenceEvent>(
    [channel],
    "presence:leave",
    handleLeave,
    enabled,
  );

  // Join on mount, leave on unmount
  useEffect(() => {
    if (!enabled || !session?.user) return;

    // Join and fetch initial presence
    sendPresence("join");
    fetchPresence();

    // Set up heartbeat
    heartbeatRef.current = setInterval(() => {
      sendPresence("heartbeat");
    }, heartbeatInterval);

    // Leave on unmount
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      sendPresence("leave");
    };
  }, [enabled, session?.user, sendPresence, fetchPresence, heartbeatInterval]);

  return {
    users,
    count: users.length,
    isConnected,
  };
}
