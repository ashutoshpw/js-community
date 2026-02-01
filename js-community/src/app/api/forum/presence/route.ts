/**
 * Presence API Route
 *
 * POST: Update user presence (heartbeat)
 * GET: Get online users for a channel
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eventStore } from "@/lib/realtime";

// In-memory presence store (use Redis in production)
const presenceStore = new Map<
  string,
  Map<number, { username: string; lastSeen: number }>
>();
const PRESENCE_TIMEOUT = 60000; // 1 minute

function cleanupStalePresence() {
  const now = Date.now();
  for (const [channel, users] of presenceStore) {
    for (const [userId, data] of users) {
      if (now - data.lastSeen > PRESENCE_TIMEOUT) {
        users.delete(userId);
        // Publish leave event
        eventStore.publish(channel, "presence:leave", {
          userId,
          username: data.username,
          channel,
        });
      }
    }
    if (users.size === 0) {
      presenceStore.delete(channel);
    }
  }
}

// Cleanup stale presence every 30 seconds
setInterval(cleanupStalePresence, 30000);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const username = session.user.name || "Anonymous";
    const body = await request.json();
    const { channel, action } = body as {
      channel: string;
      action: "join" | "leave" | "heartbeat";
    };

    if (!channel) {
      return NextResponse.json(
        { error: "Channel is required" },
        { status: 400 },
      );
    }

    if (!presenceStore.has(channel)) {
      presenceStore.set(channel, new Map());
    }
    const channelPresence = presenceStore.get(channel) as Map<
      number,
      { username: string; lastSeen: number }
    >;

    if (action === "leave") {
      if (channelPresence.has(userId)) {
        channelPresence.delete(userId);
        eventStore.publish(channel, "presence:leave", {
          userId,
          username,
          channel,
        });
      }
    } else {
      const wasPresent = channelPresence.has(userId);
      channelPresence.set(userId, { username, lastSeen: Date.now() });

      if (!wasPresent) {
        eventStore.publish(channel, "presence:join", {
          userId,
          username,
          channel,
        });
      }
    }

    return NextResponse.json({
      success: true,
      onlineCount: channelPresence.size,
    });
  } catch (error) {
    console.error("Error updating presence:", error);
    return NextResponse.json(
      { error: "Failed to update presence" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");

    if (!channel) {
      return NextResponse.json(
        { error: "Channel is required" },
        { status: 400 },
      );
    }

    cleanupStalePresence();

    const channelPresence = presenceStore.get(channel);
    const users = channelPresence
      ? Array.from(channelPresence.entries()).map(([userId, data]) => ({
          userId,
          username: data.username,
        }))
      : [];

    return NextResponse.json({
      channel,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching presence:", error);
    return NextResponse.json(
      { error: "Failed to fetch presence" },
      { status: 500 },
    );
  }
}
