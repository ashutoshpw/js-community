/**
 * Messages API Route
 *
 * GET: List user's conversations
 * POST: Create a new conversation
 */

import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { parseMarkdownAsync } from "@/lib/markdown";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const offset = Number(searchParams.get("offset")) || 0;

    // Get conversations where user is a participant
    const participantRows = await db
      .select({
        conversationId: schema.conversationParticipants.conversationId,
        lastReadAt: schema.conversationParticipants.lastReadAt,
        isMuted: schema.conversationParticipants.isMuted,
      })
      .from(schema.conversationParticipants)
      .where(
        and(
          eq(schema.conversationParticipants.userId, userId),
          isNull(schema.conversationParticipants.leftAt),
        ),
      );

    const conversationIds = participantRows.map((p) => p.conversationId);

    if (conversationIds.length === 0) {
      return NextResponse.json({
        conversations: [],
        total: 0,
        hasMore: false,
      });
    }

    // Fetch conversations with details
    const conversationsData = await Promise.all(
      conversationIds.slice(offset, offset + limit).map(async (convId) => {
        const conv = await db
          .select()
          .from(schema.conversations)
          .where(
            and(
              eq(schema.conversations.id, convId),
              isNull(schema.conversations.archivedAt),
            ),
          )
          .limit(1);

        if (conv.length === 0) return null;

        // Get participants
        const participants = await db
          .select({
            userId: schema.conversationParticipants.userId,
            username: schema.users.username,
            name: schema.users.name,
          })
          .from(schema.conversationParticipants)
          .leftJoin(
            schema.users,
            eq(schema.conversationParticipants.userId, schema.users.id),
          )
          .where(
            and(
              eq(schema.conversationParticipants.conversationId, convId),
              isNull(schema.conversationParticipants.leftAt),
            ),
          );

        // Get last message
        const lastMessage = await db
          .select({
            id: schema.privateMessages.id,
            raw: schema.privateMessages.raw,
            senderId: schema.privateMessages.senderId,
            senderUsername: schema.users.username,
            createdAt: schema.privateMessages.createdAt,
          })
          .from(schema.privateMessages)
          .leftJoin(
            schema.users,
            eq(schema.privateMessages.senderId, schema.users.id),
          )
          .where(
            and(
              eq(schema.privateMessages.conversationId, convId),
              isNull(schema.privateMessages.deletedAt),
            ),
          )
          .orderBy(desc(schema.privateMessages.createdAt))
          .limit(1);

        const participantInfo = participantRows.find(
          (p) => p.conversationId === convId,
        );

        // Calculate unread count
        const unreadCount = participantInfo?.lastReadAt
          ? await db
              .select({ id: schema.privateMessages.id })
              .from(schema.privateMessages)
              .where(
                and(
                  eq(schema.privateMessages.conversationId, convId),
                  isNull(schema.privateMessages.deletedAt),
                ),
              )
              .then(
                (msgs) =>
                  msgs.filter(
                    () =>
                      lastMessage[0]?.createdAt &&
                      participantInfo.lastReadAt &&
                      lastMessage[0].createdAt > participantInfo.lastReadAt,
                  ).length,
              )
          : conv[0].messageCount;

        return {
          id: conv[0].id,
          title: conv[0].title,
          isGroup: conv[0].isGroup,
          messageCount: conv[0].messageCount,
          lastMessageAt: conv[0].lastMessageAt.toISOString(),
          participants: participants.map((p) => ({
            userId: p.userId,
            username: p.username,
            name: p.name,
          })),
          lastMessage: lastMessage[0]
            ? {
                excerpt:
                  lastMessage[0].raw.slice(0, 100) +
                  (lastMessage[0].raw.length > 100 ? "..." : ""),
                senderUsername: lastMessage[0].senderUsername,
                createdAt: lastMessage[0].createdAt.toISOString(),
              }
            : null,
          unreadCount,
          isMuted: participantInfo?.isMuted || false,
        };
      }),
    );

    const validConversations = conversationsData.filter(Boolean);

    return NextResponse.json({
      conversations: validConversations,
      total: conversationIds.length,
      hasMore: offset + limit < conversationIds.length,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

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
    const { recipientIds, title, message } = body as {
      recipientIds: number[];
      title?: string;
      message: string;
    };

    if (!recipientIds || recipientIds.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient is required" },
        { status: 400 },
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    // Verify recipients exist
    const recipients = await db
      .select({ id: schema.users.id, username: schema.users.username })
      .from(schema.users)
      .where(eq(schema.users.id, recipientIds[0]));

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    // Check for existing 1:1 conversation
    if (recipientIds.length === 1) {
      const existingConv = await findExistingConversation(
        userId,
        recipientIds[0],
      );
      if (existingConv) {
        // Add message to existing conversation
        const cooked = await parseMarkdownAsync(message);
        await db.insert(schema.privateMessages).values({
          conversationId: existingConv,
          senderId: userId,
          raw: message,
          cooked,
          messageNumber: 1, // Will be updated by trigger
        });

        await db
          .update(schema.conversations)
          .set({
            lastMessageAt: new Date(),
            messageCount: schema.conversations.messageCount,
            updatedAt: new Date(),
          })
          .where(eq(schema.conversations.id, existingConv));

        return NextResponse.json({ conversationId: existingConv });
      }
    }

    // Create new conversation
    const [conversation] = await db
      .insert(schema.conversations)
      .values({
        title: title || null,
        createdById: userId,
        isGroup: recipientIds.length > 1,
        messageCount: 1,
      })
      .returning();

    // Add participants
    const allParticipants = [userId, ...recipientIds];
    for (const participantId of allParticipants) {
      await db.insert(schema.conversationParticipants).values({
        conversationId: conversation.id,
        userId: participantId,
        isAdmin: participantId === userId,
      });
    }

    // Add first message
    const cooked = await parseMarkdownAsync(message);
    await db.insert(schema.privateMessages).values({
      conversationId: conversation.id,
      senderId: userId,
      raw: message,
      cooked,
      messageNumber: 1,
    });

    return NextResponse.json({
      conversationId: conversation.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}

async function findExistingConversation(
  userId1: number,
  userId2: number,
): Promise<number | null> {
  // Find conversations where both users are participants and it's not a group
  const user1Convs = await db
    .select({ conversationId: schema.conversationParticipants.conversationId })
    .from(schema.conversationParticipants)
    .where(
      and(
        eq(schema.conversationParticipants.userId, userId1),
        isNull(schema.conversationParticipants.leftAt),
      ),
    );

  for (const conv of user1Convs) {
    const convDetails = await db
      .select()
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.id, conv.conversationId),
          eq(schema.conversations.isGroup, false),
        ),
      )
      .limit(1);

    if (convDetails.length === 0) continue;

    const user2Participant = await db
      .select()
      .from(schema.conversationParticipants)
      .where(
        and(
          eq(
            schema.conversationParticipants.conversationId,
            conv.conversationId,
          ),
          eq(schema.conversationParticipants.userId, userId2),
          isNull(schema.conversationParticipants.leftAt),
        ),
      )
      .limit(1);

    if (user2Participant.length > 0) {
      return conv.conversationId;
    }
  }

  return null;
}
