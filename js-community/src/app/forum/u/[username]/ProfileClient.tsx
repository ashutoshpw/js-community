/**
 * ProfileClient component
 *
 * Client-side user profile display.
 */

"use client";

import {
  Award,
  Calendar,
  Clock,
  Eye,
  FileText,
  Heart,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { RelativeTime } from "@/app/components/forum/RelativeTime";
import { UserAvatar } from "@/app/components/forum/UserAvatar";

interface UserProfile {
  user: {
    id: number;
    username: string;
    name: string | null;
    trustLevel: number;
    admin: boolean;
    moderator: boolean;
    createdAt: string;
    lastSeenAt: string | null;
  };
  profile: {
    location: string | null;
    website: string | null;
    bio: string | null;
    avatarUrl: string | null;
    profileBackgroundUrl: string | null;
    views: number;
  } | null;
  stats: {
    topicCount: number;
    postCount: number;
    likesGiven: number;
    likesReceived: number;
    daysVisited: number;
  };
  recentTopics: Array<{
    id: number;
    title: string;
    slug: string | null;
    createdAt: string;
    categoryName: string | null;
    categoryColor: string | null;
  }>;
  badges: Array<{
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    grantedAt: string;
  }>;
}

interface ProfileClientProps {
  username: string;
}

const TRUST_LEVELS: Record<number, string> = {
  0: "New User",
  1: "Basic User",
  2: "Member",
  3: "Regular",
  4: "Leader",
};

export function ProfileClient({ username }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "activity" | "badges">(
    "summary",
  );

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/forum/users/${username}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User not found
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The user &quot;{username}&quot; does not exist.
        </p>
      </div>
    );
  }

  const { user, profile: userProfile, stats, recentTopics, badges } = profile;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <UserAvatar
              user={{
                username: user.username,
                name: user.name,
                avatarUrl: userProfile?.avatarUrl,
              }}
              size="xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name || user.username}
              </h1>
              {user.admin && (
                <span className="flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              )}
              {user.moderator && !user.admin && (
                <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <Shield className="h-3 w-3" />
                  Moderator
                </span>
              )}
            </div>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>

            {userProfile?.bio && (
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {userProfile.bio}
              </p>
            )}

            {/* Meta info */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {userProfile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userProfile.location}
                </span>
              )}
              {userProfile?.website && (
                <a
                  href={userProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <LinkIcon className="h-4 w-4" />
                  Website
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {user.lastSeenAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last seen <RelativeTime date={user.lastSeenAt} />
                </span>
              )}
            </div>

            {/* Trust level */}
            <div className="mt-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-zinc-700 dark:text-gray-300">
                {TRUST_LEVELS[user.trustLevel] ||
                  `Trust Level ${user.trustLevel}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "summary"
              ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("activity")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "activity"
              ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("badges")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "badges"
              ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Badges ({badges.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "summary" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<FileText className="h-5 w-5 text-blue-500" />}
                label="Topics"
                value={stats.topicCount}
              />
              <StatItem
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                label="Posts"
                value={stats.postCount}
              />
              <StatItem
                icon={<Heart className="h-5 w-5 text-pink-500" />}
                label="Likes Given"
                value={stats.likesGiven}
              />
              <StatItem
                icon={<Heart className="h-5 w-5 text-red-500" />}
                label="Likes Received"
                value={stats.likesReceived}
              />
              <StatItem
                icon={<Calendar className="h-5 w-5 text-purple-500" />}
                label="Days Visited"
                value={stats.daysVisited}
              />
              <StatItem
                icon={<Eye className="h-5 w-5 text-gray-500" />}
                label="Profile Views"
                value={userProfile?.views || 0}
              />
            </div>
          </div>

          {/* Recent Topics */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Recent Topics
            </h2>
            {recentTopics.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No topics yet
              </p>
            ) : (
              <ul className="space-y-3">
                {recentTopics.map((topic) => (
                  <li key={topic.id}>
                    <Link
                      href={`/forum/t/${topic.id}/${topic.slug || "topic"}`}
                      className="block text-sm text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                    >
                      {topic.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {topic.categoryName && (
                        <span
                          className="rounded px-1.5 py-0.5"
                          style={{
                            backgroundColor: topic.categoryColor
                              ? `${topic.categoryColor}20`
                              : undefined,
                            color: topic.categoryColor || undefined,
                          }}
                        >
                          {topic.categoryName}
                        </span>
                      )}
                      <RelativeTime date={topic.createdAt} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {recentTopics.length > 0 && (
              <Link
                href={`/forum/u/${username}/activity?filter=topics`}
                className="mt-4 block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                View all topics
              </Link>
            )}
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-gray-600 dark:text-gray-400">
            View detailed activity on the{" "}
            <Link
              href={`/forum/u/${username}/activity`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Activity page
            </Link>
            .
          </p>
        </div>
      )}

      {activeTab === "badges" && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          {badges.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No badges earned yet
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-700/50"
                >
                  <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                    <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {badge.name}
                    </p>
                    {badge.description && (
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {badge.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Earned <RelativeTime date={badge.grantedAt} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}
