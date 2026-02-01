/**
 * Real-time Events API Route (Server-Sent Events)
 *
 * GET: Subscribe to real-time events via SSE
 */

import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { RealtimeEvent } from "@/lib/realtime";
import { eventStore } from "@/lib/realtime";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channels = searchParams.get("channels")?.split(",") || ["/global"];

  // Get authenticated user (optional for some channels)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  // Filter channels based on permissions
  const allowedChannels = channels.filter((channel) => {
    // User-specific channels require authentication
    if (channel.startsWith("/user/")) {
      const channelUserId = channel.split("/")[2];
      return userId && String(userId) === channelUserId;
    }
    // All other channels are public for now
    return true;
  });

  if (allowedChannels.length === 0) {
    return new Response("No valid channels", { status: 400 });
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  let unsubscribes: (() => void)[] = [];

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({
        type: "connected",
        channels: allowedChannels,
        timestamp: Date.now(),
      })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Subscribe to each channel
      for (const channel of allowedChannels) {
        const unsubscribe = eventStore.subscribe(
          channel,
          (event: RealtimeEvent) => {
            try {
              const message = `data: ${JSON.stringify(event)}\n\n`;
              controller.enqueue(encoder.encode(message));
            } catch {
              // Stream closed
            }
          },
        );
        unsubscribes.push(unsubscribe);
      }

      // Keep-alive ping every 30 seconds
      const pingInterval = setInterval(() => {
        try {
          const ping = `data: ${JSON.stringify({ type: "ping", timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(ping));
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        for (const unsubscribe of unsubscribes) {
          unsubscribe();
        }
        unsubscribes = [];
      });
    },
    cancel() {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      unsubscribes = [];
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
