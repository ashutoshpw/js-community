/**
 * Conversation Detail API Route
 *
 * GET: Get messages in a conversation
 * POST: Send a message to the conversation
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { parseMarkdownAsync } from "@/lib/markdown";
import { eventStore } from "@/lib/realtime";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { id } = await params;
    const conversationId = Number.parseInt(id, 10);

    if (Number.isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400 },
      );
    }

    // Verify user is a participant
    const participant = await db
      .select()
      .from(schema.conversationParticipants)
      .where(
        and(
          eq(schema.conversationParticipants.conversationId, conversationId),
          eq(schema.conversationParticipants.userId, userId),
          isNull(schema.conversationParticipants.leftAt),
        ),
      )
      .limit(1);

    if (participant.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const _before = searchParams.get("before");

    // Get conversation details
    const conversation = await db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.id, conversationId))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Get participants
    const participants = await db
      .select({
        userId: schema.conversationParticipants.userId,
        username: schema.users.username,
        name: schema.users.name,
        isAdmin: schema.conversationParticipants.isAdmin,
      })
      .from(schema.conversationParticipants)
      .leftJoin(
        schema.users,
        eq(schema.conversationParticipants.userId, schema.users.id),
      )
      .where(
        and(
          eq(schema.conversationParticipants.conversationId, conversationId),
          isNull(schema.conversationParticipants.leftAt),
        ),
      );

    // Get messages
    const messagesQuery = db
      .select({
        id: schema.privateMessages.id,
        raw: schema.privateMessages.raw,
        cooked: schema.privateMessages.cooked,
        messageNumber: schema.privateMessages.messageNumber,
        createdAt: schema.privateMessages.createdAt,
        senderId: schema.privateMessages.senderId,
        senderUsername: schema.users.username,
        senderName: schema.users.name,
      })
      .from(schema.privateMessages)
      .leftJoin(
        schema.users,
        eq(schema.privateMessages.senderId, schema.users.id),
      )
      .where(
        and(
          eq(schema.privateMessages.conversationId, conversationId),
          isNull(schema.privateMessages.deletedAt),
        ),
      )
      .orderBy(desc(schema.privateMessages.createdAt))
      .limit(limit);

    const messages = await messagesQuery;

    // Mark as read
    await db
      .update(schema.conversationParticipants)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(schema.conversationParticipants.conversationId, conversationId),
          eq(schema.conversationParticipants.userId, userId),
        ),
      );

    return NextResponse.json({
      conversation: {
        id: conversation[0].id,
        title: conversation[0].title,
        isGroup: conversation[0].isGroup,
        messageCount: conversation[0].messageCount,
        createdAt: conversation[0].createdAt.toISOString(),
      },
      participants,
      messages: messages.reverse().map((m) => ({
        id: m.id,
        content: m.cooked || m.raw,
        raw: m.raw,
        messageNumber: m.messageNumber,
        createdAt: m.createdAt.toISOString(),
        sender: {
          id: m.senderId,
          username: m.senderUsername,
          name: m.senderName,
        },
        isOwn: m.senderId === userId,
      })),
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const username = session.user.name || "Anonymous";
    const { id } = await params;
    const conversationId = Number.parseInt(id, 10);

    if (Number.isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400 },
      );
    }

    // Verify user is a participant
    const participant = await db
      .select()
      .from(schema.conversationParticipants)
      .where(
        and(
          eq(schema.conversationParticipants.conversationId, conversationId),
          eq(schema.conversationParticipants.userId, userId),
          isNull(schema.conversationParticipants.leftAt),
        ),
      )
      .limit(1);

    if (participant.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { message } = body as { message: string };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    // Get current message count
    const conv = await db
      .select({ messageCount: schema.conversations.messageCount })
      .from(schema.conversations)
      .where(eq(schema.conversations.id, conversationId))
      .limit(1);

    const messageNumber = (conv[0]?.messageCount || 0) + 1;

    // Create message
    const cooked = await parseMarkdownAsync(message);
    const [newMessage] = await db
      .insert(schema.privateMessages)
      .values({
        conversationId,
        senderId: userId,
        raw: message,
        cooked,
        messageNumber,
      })
      .returning();

    // Update conversation
    await db
      .update(schema.conversations)
      .set({
        lastMessageAt: new Date(),
        messageCount: messageNumber,
        updatedAt: new Date(),
      })
      .where(eq(schema.conversations.id, conversationId));

    // Update sender's last read
    await db
      .update(schema.conversationParticipants)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(schema.conversationParticipants.conversationId, conversationId),
          eq(schema.conversationParticipants.userId, userId),
        ),
      );

    // Publish real-time event
    const channel = `/conversation/${conversationId}`;
    eventStore.publish(
      channel,
      "post:created",
      {
        id: newMessage.id,
        conversationId,
        messageNumber,
        senderId: userId,
        senderUsername: username,
        content: cooked || message,
      },
      userId,
    );

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: cooked || message,
        messageNumber,
        createdAt: newMessage.createdAt.toISOString(),
        sender: {
          id: userId,
          username,
        },
        isOwn: true,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
