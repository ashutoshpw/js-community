/**
 * Typing Indicator API Route
 *
 * POST: Send typing indicator
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eventStore, getChannelName } from "@/lib/realtime";

// In-memory typing store (use Redis in production)
const typingStore = new Map<
  number,
  Map<number, { username: string; expiresAt: number }>
>();
const TYPING_TIMEOUT = 5000; // 5 seconds

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
    const { topicId, action } = body as {
      topicId: number;
      action: "start" | "stop";
    };

    if (!topicId) {
      return NextResponse.json(
        { error: "topicId is required" },
        { status: 400 },
      );
    }

    if (!typingStore.has(topicId)) {
      typingStore.set(topicId, new Map());
    }
    const topicTyping = typingStore.get(topicId) as Map<
      number,
      { username: string; expiresAt: number }
    >;

    const channel = getChannelName("topic", topicId);

    if (action === "stop") {
      if (topicTyping.has(userId)) {
        topicTyping.delete(userId);
        eventStore.publish(channel, "typing:stop", {
          userId,
          username,
          topicId,
        });
      }
    } else {
      const wasTyping = topicTyping.has(userId);
      topicTyping.set(userId, {
        username,
        expiresAt: Date.now() + TYPING_TIMEOUT,
      });

      if (!wasTyping) {
        eventStore.publish(channel, "typing:start", {
          userId,
          username,
          topicId,
        });
      }

      // Auto-expire after timeout
      setTimeout(() => {
        const current = typingStore.get(topicId)?.get(userId);
        if (current && current.expiresAt <= Date.now()) {
          typingStore.get(topicId)?.delete(userId);
          eventStore.publish(channel, "typing:stop", {
            userId,
            username,
            topicId,
          });
        }
      }, TYPING_TIMEOUT);
    }

    // Get current typing users
    const typingUsers = Array.from(topicTyping.entries())
      .filter(([_, data]) => data.expiresAt > Date.now())
      .map(([id, data]) => ({ userId: id, username: data.username }));

    return NextResponse.json({
      success: true,
      typingUsers,
    });
  } catch (error) {
    console.error("Error updating typing:", error);
    return NextResponse.json(
      { error: "Failed to update typing indicator" },
      { status: 500 },
    );
  }
}
