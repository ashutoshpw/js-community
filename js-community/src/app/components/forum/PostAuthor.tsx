/**
 * PostAuthor component
 *
 * Displays the author information in a post sidebar.
 * Shows avatar, username, badges, and trust level.
 */

import { Crown, Shield, Star } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";

interface PostAuthorProps {
  author: {
    id: number;
    username: string;
    name?: string | null;
    admin?: boolean;
    moderator?: boolean;
    trustLevel?: number;
    avatarUrl?: string | null;
  };
  postNumber: number;
  createdAt: Date | string;
}

export function PostAuthor({ author, postNumber, createdAt }: PostAuthorProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* Avatar */}
      <Link href={`/forum/u/${author.username}`} className="group">
        <UserAvatar
          user={{
            username: author.username,
            name: author.name,
            avatarUrl: author.avatarUrl,
          }}
          size="lg"
          className="transition-opacity group-hover:opacity-80"
        />
      </Link>

      {/* Username */}
      <div className="space-y-0.5">
        <Link
          href={`/forum/u/${author.username}`}
          className="block font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        >
          {author.name || author.username}
        </Link>

        {author.name && (
          <Link
            href={`/forum/u/${author.username}`}
            className="block text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            @{author.username}
          </Link>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1">
        {author.admin && (
          <span
            className="flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
            title="Admin"
          >
            <Crown className="h-3 w-3" />
            Admin
          </span>
        )}
        {author.moderator && !author.admin && (
          <span
            className="flex items-center gap-0.5 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
            title="Moderator"
          >
            <Shield className="h-3 w-3" />
            Mod
          </span>
        )}
        {author.trustLevel !== undefined && author.trustLevel >= 3 && (
          <span
            className="flex items-center gap-0.5 rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            title={`Trust Level ${author.trustLevel}`}
          >
            <Star className="h-3 w-3" />
            TL{author.trustLevel}
          </span>
        )}
      </div>

      {/* Post meta */}
      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        <div title={`${formattedDate} at ${formattedTime}`}>
          {formattedDate}
        </div>
        <div className="text-gray-300 dark:text-gray-600">#{postNumber}</div>
      </div>
    </div>
  );
}
