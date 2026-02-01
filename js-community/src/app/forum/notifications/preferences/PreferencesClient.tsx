/**
 * PreferencesClient component
 *
 * Client-side notification preferences form.
 */

"use client";

import { ArrowLeft, Bell, Mail, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";

interface Preferences {
  emailOnMention: boolean;
  emailOnReply: boolean;
  emailOnQuote: boolean;
  emailOnLike: boolean;
  emailOnPrivateMessage: boolean;
  emailDigestFrequency: string;
  mutedCategories: number[];
  mutedTags: number[];
}

const DEFAULT_PREFERENCES: Preferences = {
  emailOnMention: true,
  emailOnReply: true,
  emailOnQuote: true,
  emailOnLike: false,
  emailOnPrivateMessage: true,
  emailDigestFrequency: "daily",
  mutedCategories: [],
  mutedTags: [],
};

export function PreferencesClient() {
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/forum/notifications/preferences");
        if (response.ok) {
          const data = await response.json();
          setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences });
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/forum/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/forum/notifications"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notifications
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notification Preferences
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Control how and when you receive notifications.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email Notifications
          </h2>
        </div>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Choose which notifications you&apos;d like to receive via email.
        </p>

        <div className="space-y-4">
          <ToggleSetting
            label="Mentions"
            description="When someone @mentions you in a post"
            enabled={preferences.emailOnMention}
            onChange={() => handleToggle("emailOnMention")}
          />
          <ToggleSetting
            label="Replies"
            description="When someone replies to your post"
            enabled={preferences.emailOnReply}
            onChange={() => handleToggle("emailOnReply")}
          />
          <ToggleSetting
            label="Quotes"
            description="When someone quotes your post"
            enabled={preferences.emailOnQuote}
            onChange={() => handleToggle("emailOnQuote")}
          />
          <ToggleSetting
            label="Likes"
            description="When someone likes your post"
            enabled={preferences.emailOnLike}
            onChange={() => handleToggle("emailOnLike")}
          />
          <ToggleSetting
            label="Private Messages"
            description="When you receive a private message"
            enabled={preferences.emailOnPrivateMessage}
            onChange={() => handleToggle("emailOnPrivateMessage")}
          />
        </div>
      </div>

      {/* Email Digest */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email Digest
          </h2>
        </div>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Receive a summary of activity when you haven&apos;t visited in a
          while.
        </p>

        <div>
          <label
            htmlFor="digest-frequency"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Digest Frequency
          </label>
          <select
            id="digest-frequency"
            value={preferences.emailDigestFrequency}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                emailDigestFrequency: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
          >
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saveSuccess && (
          <span className="text-sm text-green-600 dark:text-green-400">
            Preferences saved successfully!
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <LoadingSpinner />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

function ToggleSetting({
  label,
  description,
  enabled,
  onChange,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
