/**
 * Publish Real-time Event API Route
 *
 * POST: Publish an event to a channel (internal use)
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { RealtimeEventType } from "@/lib/realtime";
import { eventStore } from "@/lib/realtime";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await request.json();
    const { channel, type, data } = body as {
      channel: string;
      type: RealtimeEventType;
      data: unknown;
    };

    if (!channel || !type) {
      return NextResponse.json(
        { error: "Channel and type are required" },
        { status: 400 },
      );
    }

    // Publish the event
    const event = eventStore.publish(channel, type, data, userId);

    return NextResponse.json({
      success: true,
      event: {
        type: event.type,
        channel: event.channel,
        timestamp: event.timestamp,
      },
    });
  } catch (error) {
    console.error("Error publishing event:", error);
    return NextResponse.json(
      { error: "Failed to publish event" },
      { status: 500 },
    );
  }
}
