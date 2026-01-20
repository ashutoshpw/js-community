/**
 * User profile page
 * Route: /u/[username]
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileBadges from "./components/ProfileBadges";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

/**
 * Fetch user profile data
 */
async function getUserProfile(username: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users/${username}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profileData = await getUserProfile(username);

  if (!profileData) {
    return {
      title: "User Not Found | JS Community",
    };
  }

  return {
    title: `${profileData.user.name || profileData.user.username} (@${profileData.user.username}) | JS Community`,
    description:
      profileData.profile.bioRaw ||
      `View ${profileData.user.username}'s profile on JS Community`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profileData = await getUserProfile(username);

  if (!profileData) {
    notFound();
  }

  const { user, profile, badges } = profileData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ProfileHeader user={user} profile={profile} />

          <div className="p-6 space-y-6">
            <ProfileStats user={user} profile={profile} />

            {badges.length > 0 && <ProfileBadges badges={badges} />}

            {profile.bioCooked && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About
                </h3>
                <div
                  className="text-gray-700 prose max-w-none"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Profile bio is sanitized server-side
                  dangerouslySetInnerHTML={{ __html: profile.bioCooked }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
