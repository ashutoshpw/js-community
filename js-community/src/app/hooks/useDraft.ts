/**
 * useDraft hook
 *
 * Auto-saves draft content to localStorage with debouncing.
 * Restores draft on mount and clears on successful submission.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DraftData {
  title?: string;
  content: string;
  categoryId?: number | null;
  tags?: string[];
  replyToPostNumber?: number | null;
  updatedAt: number;
}

interface UseDraftOptions {
  key: string;
  debounceMs?: number;
  expirationMs?: number;
}

interface UseDraftReturn {
  draft: DraftData | null;
  saveDraft: (data: Partial<DraftData>) => void;
  clearDraft: () => void;
  isRestored: boolean;
}

const DEFAULT_DEBOUNCE_MS = 1000;
const DEFAULT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useDraft({
  key,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  expirationMs = DEFAULT_EXPIRATION_MS,
}: UseDraftOptions): UseDraftReturn {
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `draft:${key}`;

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: DraftData = JSON.parse(stored);
        const now = Date.now();

        // Check if draft has expired
        if (now - parsed.updatedAt < expirationMs) {
          setDraft(parsed);
        } else {
          // Remove expired draft
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
    setIsRestored(true);
  }, [storageKey, expirationMs]);

  // Save draft with debouncing
  const saveDraft = useCallback(
    (data: Partial<DraftData>) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        try {
          const newDraft: DraftData = {
            ...draft,
            ...data,
            content: data.content ?? draft?.content ?? "",
            updatedAt: Date.now(),
          };

          // Only save if there's actual content
          if (newDraft.content.trim() || newDraft.title?.trim()) {
            localStorage.setItem(storageKey, JSON.stringify(newDraft));
            setDraft(newDraft);
          }
        } catch (error) {
          console.error("Failed to save draft:", error);
        }
      }, debounceMs);
    },
    [draft, storageKey, debounceMs]
  );

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setDraft(null);

      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, [storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    draft,
    saveDraft,
    clearDraft,
    isRestored,
  };
}

/**
 * Generate a unique draft key for different contexts
 */
export function getDraftKey(context: {
  type: "new-topic" | "reply" | "edit";
  topicId?: number;
  postId?: number;
  categoryId?: number;
}): string {
  switch (context.type) {
    case "new-topic":
      return context.categoryId
        ? `new-topic:category:${context.categoryId}`
        : "new-topic:global";
    case "reply":
      return `reply:topic:${context.topicId}`;
    case "edit":
      return `edit:post:${context.postId}`;
    default:
      return "unknown";
  }
}
