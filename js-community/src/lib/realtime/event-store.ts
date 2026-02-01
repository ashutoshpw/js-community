/**
 * In-memory event store for real-time updates
 *
 * In production, this should be replaced with Redis pub/sub
 */

import type { RealtimeEvent, RealtimeEventType } from "./types";

type EventCallback = (event: RealtimeEvent) => void;

class EventStore {
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  private recentEvents: Map<string, RealtimeEvent[]> = new Map();
  private maxEventsPerChannel = 100;

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)?.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(channel);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  /**
   * Publish an event to a channel
   */
  publish<T>(
    channel: string,
    type: RealtimeEventType,
    data: T,
    userId?: number,
  ): RealtimeEvent<T> {
    const event: RealtimeEvent<T> = {
      type,
      channel,
      data,
      timestamp: Date.now(),
      userId,
    };

    // Store event in recent events
    if (!this.recentEvents.has(channel)) {
      this.recentEvents.set(channel, []);
    }
    const events = this.recentEvents.get(channel) as RealtimeEvent[];
    events.push(event as RealtimeEvent);
    if (events.length > this.maxEventsPerChannel) {
      events.shift();
    }

    // Notify subscribers
    const callbacks = this.subscribers.get(channel);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(event as RealtimeEvent);
        } catch (error) {
          console.error("Error in event callback:", error);
        }
      }
    }

    // Also notify global subscribers
    const globalCallbacks = this.subscribers.get("/global");
    if (globalCallbacks && channel !== "/global") {
      for (const callback of globalCallbacks) {
        try {
          callback(event as RealtimeEvent);
        } catch (error) {
          console.error("Error in global callback:", error);
        }
      }
    }

    return event;
  }

  /**
   * Get recent events for a channel
   */
  getRecentEvents(channel: string, since?: number): RealtimeEvent[] {
    const events = this.recentEvents.get(channel) || [];
    if (since) {
      return events.filter((e) => e.timestamp > since);
    }
    return [...events];
  }

  /**
   * Get subscriber count for a channel
   */
  getSubscriberCount(channel: string): number {
    return this.subscribers.get(channel)?.size || 0;
  }

  /**
   * Clear all events for a channel
   */
  clearChannel(channel: string): void {
    this.recentEvents.delete(channel);
  }
}

// Singleton instance
export const eventStore = new EventStore();
