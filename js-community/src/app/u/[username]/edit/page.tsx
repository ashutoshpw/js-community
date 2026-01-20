/**
 * Profile edit page
 * Route: /u/[username]/edit
 */

import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import ProfileEditForm from "./components/ProfileEditForm";

type ProfileEditPageProps = {
  params: Promise<{ username: string }>;
};

export const metadata: Metadata = {
  title: "Edit Profile | JS Community",
  description: "Edit your profile settings",
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

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { username } = await params;
  const headersList = await headers();
  const session = await getServerSession(headersList);

  // Require authentication
  if (!session?.user) {
    redirect("/login");
  }

  const profileData = await getUserProfile(username);

  // Check if user exists
  if (!profileData) {
    redirect("/");
  }

  // Verify user is editing their own profile
  if (session.user.id !== profileData.user.id) {
    redirect(`/u/${username}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update your profile information and settings
            </p>
          </div>

          <div className="p-6">
            <ProfileEditForm
              user={profileData.user}
              profile={profileData.profile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
