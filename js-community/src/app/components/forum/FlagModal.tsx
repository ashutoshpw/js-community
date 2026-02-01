/**
 * FlagModal component
 *
 * Modal for reporting/flagging posts with reason selection.
 */

"use client";

import { AlertTriangle, Flag, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface FlagModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FLAG_REASONS = [
  {
    id: "spam",
    label: "It's spam",
    description: "This post is an advertisement or vandalism",
    icon: "🚫",
  },
  {
    id: "inappropriate",
    label: "It's inappropriate",
    description: "This post contains offensive or harmful content",
    icon: "⚠️",
  },
  {
    id: "off-topic",
    label: "It's off-topic",
    description: "This post is not relevant to the discussion",
    icon: "📋",
  },
  {
    id: "something-else",
    label: "Something else",
    description: "Describe the issue in your own words",
    icon: "💬",
  },
];

export function FlagModal({
  postId,
  isOpen,
  onClose,
  onSuccess,
}: FlagModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setCustomMessage("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Please select a reason for flagging");
      return;
    }

    if (selectedReason === "something-else" && !customMessage.trim()) {
      setError("Please describe the issue");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/forum/posts/${postId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "flag",
          reason: selectedReason,
          message: customMessage.trim() || undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit flag");
      }
    } catch (_err) {
      setError("Failed to submit flag. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Flag This Post
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Flag className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Thanks for letting us know
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our moderators will review this post shortly.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Please select the reason you&apos;re flagging this post. Our
                moderators will be notified and will review it.
              </p>

              {/* Reason Selection */}
              <div className="space-y-2">
                {FLAG_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason.id);
                      setError(null);
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selectedReason === reason.id
                        ? "border-orange-500 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-700/50"
                    }`}
                  >
                    <span className="text-xl">{reason.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reason.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {reason.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom message for "something else" */}
              {selectedReason === "something-else" && (
                <div className="mt-4">
                  <label
                    htmlFor="flag-message"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Please describe the issue
                  </label>
                  <textarea
                    id="flag-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Tell us more about why you're flagging this post..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    rows={3}
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3 dark:border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Flag
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
