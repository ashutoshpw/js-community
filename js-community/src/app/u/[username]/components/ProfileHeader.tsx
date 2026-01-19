/**
 * Profile header component
 * Displays avatar, username, name, and edit button
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  name: string | null;
  trustLevel: number;
  admin: boolean;
  moderator: boolean;
  active: boolean;
  suspended: boolean;
  createdAt: string;
  lastSeenAt: string | null;
};

type Profile = {
  location: string | null;
  website: string | null;
  bioRaw: string | null;
  bioCooked: string | null;
  avatarUrl: string | null;
  profileBackgroundUrl: string | null;
  cardBackgroundUrl: string | null;
  views: number;
};

type ProfileHeaderProps = {
  user: User;
  profile: Profile;
};

export default function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // Check if this is the current user's profile
    async function checkOwnProfile() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const session = await response.json();
          setIsOwnProfile(session?.user?.id === user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }

    checkOwnProfile();
  }, [user.id]);

  const trustLevelBadge = () => {
    const levels = [
      { level: 0, label: "New User", color: "bg-gray-500" },
      { level: 1, label: "Basic User", color: "bg-blue-500" },
      { level: 2, label: "Member", color: "bg-green-500" },
      { level: 3, label: "Regular", color: "bg-purple-500" },
      { level: 4, label: "Leader", color: "bg-yellow-500" },
    ];
    const trust = levels[user.trustLevel] || levels[0];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${trust.color}`}
      >
        {trust.label}
      </span>
    );
  };

  return (
    <div
      className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"
      style={
        profile.profileBackgroundUrl
          ? {
              backgroundImage: `url(${profile.profileBackgroundUrl})`,
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className="h-full flex items-end">
        <div className="w-full p-6 bg-gradient-to-t from-black/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                {profile.avatarUrl ? (
                  // biome-ignore lint/performance/noImgElement: External avatar URLs may not be optimizable
                  <img
                    src={profile.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-600">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {user.name || user.username}
                </h1>
                <p className="text-sm opacity-90">@{user.username}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {trustLevelBadge()}
                  {user.admin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                      Admin
                    </span>
                  )}
                  {user.moderator && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                      Moderator
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <Link
                href={`/u/${user.username}/edit`}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
