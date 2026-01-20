/**
 * Avatar upload component
 * Allows users to upload and update their profile picture
 */

"use client";

import { useState } from "react";

type AvatarUploadProps = {
  currentAvatarUrl: string | null;
  username: string;
  onAvatarUpdate: (avatarUrl: string) => void;
};

export default function AvatarUpload({
  currentAvatarUrl,
  username,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In a real implementation, you would upload to a storage service
      // For now, we'll just simulate an upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulated avatar URL - in production, this would be the uploaded image URL
      const mockAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
      onAvatarUpdate(mockAvatarUrl);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="block text-sm font-medium text-gray-700">
        Profile Picture
      </div>

      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
          {previewUrl ? (
            // biome-ignore lint/performance/noImgElement: Preview from FileReader cannot use Next.js Image
            <img
              src={previewUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">
                {username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="sr-only"
            />
            {isUploading ? "Uploading..." : "Change Avatar"}
          </label>
          <p className="mt-2 text-sm text-gray-500">
            JPG, PNG or GIF. Max size 5MB.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
