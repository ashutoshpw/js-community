/**
 * Profile edit form component
 * Allows users to update their profile information
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AvatarUpload from "./AvatarUpload";

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

type ProfileEditFormProps = {
  user: User;
  profile: Profile;
};

export default function ProfileEditForm({
  user,
  profile,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    location: profile.location || "",
    website: profile.website || "",
    bioRaw: profile.bioRaw || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/users/${user.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);

      // Redirect to profile page after success
      setTimeout(() => {
        router.push(`/u/${user.username}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    // In a real implementation, this would update the avatar URL
    console.log("Avatar updated:", avatarUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error updating profile
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Profile updated successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Redirecting to your profile...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AvatarUpload
        currentAvatarUrl={profile.avatarUrl}
        username={user.username}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Your display name"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Where are you located?"
        />
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <label
          htmlFor="bioRaw"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bioRaw"
          name="bioRaw"
          rows={4}
          value={formData.bioRaw}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Tell us about yourself..."
        />
        <p className="mt-2 text-sm text-gray-500">
          You can use markdown formatting
        </p>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push(`/u/${user.username}`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
