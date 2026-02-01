/**
 * useRealtime hook for subscribing to real-time events
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeEvent, RealtimeEventType } from "@/lib/realtime/types";

interface UseRealtimeOptions {
  channels: string[];
  onEvent?: (event: RealtimeEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  lastEvent: RealtimeEvent | null;
  reconnect: () => void;
}

export function useRealtime({
  channels,
  onEvent,
  onConnect,
  onDisconnect,
  onError,
  enabled = true,
  reconnectDelay = 3000,
  maxReconnectAttempts = 5,
}: UseRealtimeOptions): UseRealtimeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled || channels.length === 0) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const channelParam = channels.join(",");
    const url = `/api/forum/realtime?channels=${encodeURIComponent(channelParam)}`;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      onConnect?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeEvent | { type: string };

        // Handle ping/pong
        if (data.type === "ping" || data.type === "connected") {
          return;
        }

        const realtimeEvent = data as RealtimeEvent;
        setLastEvent(realtimeEvent);
        onEvent?.(realtimeEvent);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      onDisconnect?.();

      // Attempt reconnection
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay * reconnectAttemptsRef.current);
      } else {
        onError?.(new Error("Max reconnection attempts reached"));
      }
    };
  }, [
    channels,
    enabled,
    onEvent,
    onConnect,
    onDisconnect,
    onError,
    reconnectDelay,
    maxReconnectAttempts,
  ]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastEvent,
    reconnect,
  };
}

/**
 * Hook for subscribing to specific event types
 */
export function useRealtimeEvent<T = unknown>(
  channels: string[],
  eventType: RealtimeEventType | RealtimeEventType[],
  callback: (data: T, event: RealtimeEvent<T>) => void,
  enabled = true,
): { isConnected: boolean } {
  const eventTypes = Array.isArray(eventType) ? eventType : [eventType];

  const handleEvent = useCallback(
    (event: RealtimeEvent) => {
      if (eventTypes.includes(event.type)) {
        callback(event.data as T, event as RealtimeEvent<T>);
      }
    },
    [eventTypes, callback],
  );

  const { isConnected } = useRealtime({
    channels,
    onEvent: handleEvent,
    enabled,
  });

  return { isConnected };
}
