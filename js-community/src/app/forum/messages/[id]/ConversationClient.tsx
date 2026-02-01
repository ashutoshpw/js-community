/**
 * Conversation Client Component
 */

"use client";

import { ArrowLeft, Send, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { RelativeTime } from "@/app/components/forum/RelativeTime";
import { useRealtime } from "@/app/hooks/useRealtime";
import { useSession } from "@/lib/auth-client";

interface Participant {
  userId: number;
  username: string;
  name: string | null;
  isAdmin: boolean;
}

interface Message {
  id: number;
  content: string;
  raw: string;
  messageNumber: number;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    name: string | null;
  };
  isOwn: boolean;
}

interface ConversationData {
  id: number;
  title: string | null;
  isGroup: boolean;
  messageCount: number;
  createdAt: string;
}

interface ConversationClientProps {
  conversationId: string;
}

export function ConversationClient({
  conversationId,
}: ConversationClientProps) {
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<ConversationData | null>(
    null,
  );
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchConversation = useCallback(async () => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/forum/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data.conversation);
        setParticipants(data.participants);
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      } else if (response.status === 403) {
        setError("You don't have access to this conversation");
      } else {
        setError("Failed to load conversation");
      }
    } catch {
      setError("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, conversationId, scrollToBottom]);

  useEffect(() => {
    if (session?.user) {
      fetchConversation();
    } else {
      setIsLoading(false);
    }
  }, [session?.user, fetchConversation]);

  // Real-time updates
  useRealtime({
    channels: [`/conversation/${conversationId}`],
    enabled: !!session?.user && !!conversation,
    onEvent: (event) => {
      if (event.type === "post:created") {
        const newMsg = event.data as Message & { conversationId: number };
        if (newMsg.sender.id !== Number(session?.user?.id)) {
          setMessages((prev) => [...prev, { ...newMsg, isOwn: false }]);
          scrollToBottom();
        }
      }
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/forum/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        scrollToBottom();
      }
    } catch {
      console.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getConversationTitle = (): string => {
    if (conversation?.title) return conversation.title;
    const others = participants.filter(
      (p) => p.userId !== Number(session?.user?.id),
    );
    if (others.length === 0) return "Conversation";
    return others.map((p) => p.name || p.username).join(", ");
  };

  if (!session?.user) {
    return (
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view messages.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link
          href="/forum/messages"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Messages
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 dark:border-zinc-700">
        <Link
          href="/forum/messages"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 dark:text-white">
            {getConversationTitle()}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  msg.isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white"
                }`}
              >
                {!msg.isOwn && (
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {msg.sender.name || msg.sender.username}
                  </p>
                )}
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized markdown from server
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                <p
                  className={`mt-1 text-right text-xs ${
                    msg.isOwn ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  <RelativeTime date={msg.createdAt} />
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-gray-200 pt-4 dark:border-zinc-700"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || isSending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
