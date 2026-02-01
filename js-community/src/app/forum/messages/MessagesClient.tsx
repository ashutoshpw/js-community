/**
 * Messages Client Component
 */

"use client";

import { MessageSquare, PenSquare, Search, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/app/components/forum/EmptyState";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { RelativeTime } from "@/app/components/forum/RelativeTime";
import { useSession } from "@/lib/auth-client";

interface Participant {
  userId: number;
  username: string;
  name: string | null;
}

interface ConversationData {
  id: number;
  title: string | null;
  isGroup: boolean;
  messageCount: number;
  lastMessageAt: string;
  participants: Participant[];
  lastMessage: {
    excerpt: string;
    senderUsername: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  isMuted: boolean;
}

export function MessagesClient() {
  const { data: session } = useSession();
  const _router = useRouter();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConversations = useCallback(async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/forum/messages");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    } else {
      setIsLoading(false);
    }
  }, [session?.user, fetchConversations]);

  if (!session?.user) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Sign in to view messages
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          You need to be logged in to access your private messages.
        </p>
        <Link
          href="/forum/login"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const getConversationTitle = (conv: ConversationData): string => {
    if (conv.title) return conv.title;
    const otherParticipants = conv.participants.filter(
      (p) => p.userId !== Number(session.user.id),
    );
    if (otherParticipants.length === 0) return "Just you";
    return otherParticipants.map((p) => p.name || p.username).join(", ");
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const title = getConversationTitle(conv).toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages
        </h1>
        <Link
          href="/forum/messages/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PenSquare className="h-4 w-4" />
          New Message
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={searchQuery ? "No conversations found" : "No messages yet"}
          description={
            searchQuery
              ? "Try a different search term"
              : "Start a conversation with someone in the community"
          }
          action={
            !searchQuery && (
              <Link
                href="/forum/messages/new"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <PenSquare className="h-4 w-4" />
                Start a Conversation
              </Link>
            )
          }
        />
      ) : (
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800">
          {filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/forum/messages/${conv.id}`}
              className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                {conv.isGroup ? (
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`truncate font-medium ${
                      conv.unreadCount > 0
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {getConversationTitle(conv)}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    <RelativeTime date={conv.lastMessageAt} />
                  </span>
                </div>
                {conv.lastMessage && (
                  <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {conv.lastMessage.senderUsername}:
                    </span>{" "}
                    {conv.lastMessage.excerpt}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {conv.messageCount} messages
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                      {conv.unreadCount} new
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
