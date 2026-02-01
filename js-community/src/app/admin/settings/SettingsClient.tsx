/**
 * Admin Settings Client Component
 */

"use client";

import { RefreshCw, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Setting {
  id: number;
  name: string;
  dataType: string;
  value: string | null;
  description: string | null;
  category: string;
}

type SettingsGroup = Record<string, Setting[]>;

export function SettingsClient() {
  const [settings, setSettings] = useState<SettingsGroup>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setCategories(data.categories);
        setActiveCategory((prev) => {
          if (!prev && data.categories.length > 0) {
            return data.categories[0];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function handleChange(name: string, value: string) {
    setChanges((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (Object.keys(changes).length === 0) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const settingsToUpdate = Object.entries(changes).map(([name, value]) => ({
        name,
        value,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully" });
        setChanges({});
        fetchSettings();
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to save settings",
        });
      }
    } catch (_error) {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setIsSaving(false);
    }
  }

  function getSettingValue(setting: Setting): string {
    if (setting.name in changes) {
      return changes[setting.name];
    }
    return setting.value || "";
  }

  function renderSettingInput(setting: Setting) {
    const value = getSettingValue(setting);
    const baseClasses =
      "w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800";

    switch (setting.dataType) {
      case "boolean":
        return (
          <select
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            className={baseClasses}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case "integer":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            className={baseClasses}
          />
        );
      case "list":
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            placeholder="One item per line"
            rows={3}
            className={baseClasses}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            className={baseClasses}
          />
        );
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-gray-500 dark:text-gray-400">
          No settings configured. Default settings will be used.
        </p>
      </div>
    );
  }

  const activeSettings = settings[activeCategory] || [];

  return (
    <div className="space-y-4">
      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeCategory === category
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-6">
          {activeSettings.map((setting) => (
            <div key={setting.id}>
              <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                {setting.name
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              {renderSettingInput(setting)}
              {setting.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {setting.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={Object.keys(changes).length === 0 || isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
