/**
 * New Message Client Component
 */

"use client";

import { ArrowLeft, Send, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

interface UserSuggestion {
  id: number;
  username: string;
  name: string | null;
}

export function NewMessageClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [recipients, setRecipients] = useState<UserSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [message, setMessage] = useState("");
  const [_isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/forum/users/search?q=${encodeURIComponent(query)}`,
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out already selected and self
        const filtered = (data.users || []).filter(
          (u: UserSuggestion) =>
            !recipients.some((r) => r.id === u.id) &&
            u.id !== Number(session?.user?.id),
        );
        setSuggestions(filtered);
      }
    } catch {
      console.error("Error searching users");
    } finally {
      setIsSearching(false);
    }
  };

  const addRecipient = (user: UserSuggestion) => {
    setRecipients([...recipients, user]);
    setSearchQuery("");
    setSuggestions([]);
  };

  const removeRecipient = (userId: number) => {
    setRecipients(recipients.filter((r) => r.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (recipients.length === 0) {
      setError("Please add at least one recipient");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: recipients.map((r) => r.id),
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/forum/messages/${data.conversationId}`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to send messages.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/forum/messages"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          New Message
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipients */}
        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            To:
          </span>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              {recipients.map((recipient) => (
                <span
                  key={recipient.id}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {recipient.name || recipient.username}
                  <button
                    type="button"
                    onClick={() => removeRecipient(recipient.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                placeholder={
                  recipients.length === 0
                    ? "Search for users..."
                    : "Add more..."
                }
                className="min-w-[150px] flex-1 bg-transparent py-1 text-sm outline-none dark:text-white"
                aria-label="Search for recipients"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border-t border-gray-100 pt-2 dark:border-zinc-700">
                {suggestions.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addRecipient(user)}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.name || user.username}
                    </span>
                    <span className="text-gray-500">@{user.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message:
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={6}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            aria-label="Message content"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSending || recipients.length === 0 || !message.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
