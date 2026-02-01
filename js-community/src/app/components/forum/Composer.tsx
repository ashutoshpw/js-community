/**
 * Composer component
 *
 * Full-featured post composer with markdown editor, preview, and submission.
 */

"use client";

import { Edit3, Eye, Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDraftKey, useDraft } from "@/app/hooks/useDraft";
import { CategorySelector } from "./CategorySelector";
import { ComposerToolbar } from "./ComposerToolbar";
import { MarkdownEditor } from "./MarkdownEditor";
import { MarkdownPreview } from "./MarkdownPreview";
import { TagInput } from "./TagInput";

type ComposerMode = "new-topic" | "reply" | "edit";

interface ComposerProps {
  mode: ComposerMode;
  topicId?: number;
  postId?: number;
  categoryId?: number;
  replyToPostNumber?: number | null;
  initialTitle?: string;
  initialContent?: string;
  initialCategoryId?: number | null;
  initialTags?: string[];
  onSubmit: (data: {
    title?: string;
    content: string;
    categoryId?: number | null;
    tags?: string[];
    replyToPostNumber?: number | null;
  }) => Promise<void>;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function Composer({
  mode,
  topicId,
  postId,
  categoryId,
  replyToPostNumber,
  initialTitle = "",
  initialContent = "",
  initialCategoryId = null,
  initialTags = [],
  onSubmit,
  onCancel,
  onSuccess,
}: ComposerProps) {
  // Draft management
  const draftKey = getDraftKey({
    type: mode,
    topicId,
    postId,
    categoryId,
  });
  const { draft, saveDraft, clearDraft, isRestored } = useDraft({
    key: draftKey,
  });

  // Form state
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    initialCategoryId,
  );
  const [tags, setTags] = useState<string[]>(initialTags);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Restore draft on mount
  useEffect(() => {
    if (isRestored && draft) {
      if (draft.title && mode === "new-topic") setTitle(draft.title);
      if (draft.content) setContent(draft.content);
      if (draft.categoryId !== undefined)
        setSelectedCategoryId(draft.categoryId);
      if (draft.tags) setTags(draft.tags);
    }
  }, [isRestored, draft, mode]);

  // Auto-save draft on changes
  useEffect(() => {
    if (!isRestored) return;
    saveDraft({
      title: mode === "new-topic" ? title : undefined,
      content,
      categoryId: selectedCategoryId,
      tags,
      replyToPostNumber,
    });
  }, [
    title,
    content,
    selectedCategoryId,
    tags,
    replyToPostNumber,
    saveDraft,
    isRestored,
    mode,
  ]);

  // Insert text at cursor position
  const handleInsert = useCallback(
    (prefix: string, suffix: string, placeholder?: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder || "";

      const newContent =
        content.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        content.substring(end);

      setContent(newContent);

      // Set cursor position
      requestAnimationFrame(() => {
        if (selectedText) {
          editor.selectionStart = start;
          editor.selectionEnd =
            start + prefix.length + textToInsert.length + suffix.length;
        } else {
          editor.selectionStart = start + prefix.length;
          editor.selectionEnd = start + prefix.length + textToInsert.length;
        }
        editor.focus();
      });
    },
    [content],
  );

  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validation
    if (mode === "new-topic" && !title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: mode === "new-topic" ? title.trim() : undefined,
        content: content.trim(),
        categoryId: selectedCategoryId,
        tags: mode === "new-topic" ? tags : undefined,
        replyToPostNumber,
      });

      // Clear draft on success
      clearDraft();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showTitleField = mode === "new-topic";
  const showCategoryField = mode === "new-topic";
  const showTagsField = mode === "new-topic";

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {mode === "new-topic" && "Create New Topic"}
          {mode === "reply" && (
            <>
              Reply
              {replyToPostNumber && (
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  to #{replyToPostNumber}
                </span>
              )}
            </>
          )}
          {mode === "edit" && "Edit Post"}
        </h3>
        <div className="flex items-center gap-2">
          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
              showPreview
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
            }`}
          >
            {showPreview ? (
              <>
                <Edit3 className="h-4 w-4" /> Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Preview
              </>
            )}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Title field (new topic only) */}
      {showTitleField && (
        <div className="border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic title..."
            disabled={isSubmitting}
            className="w-full border-none bg-transparent text-lg font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-0 disabled:text-gray-500 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      )}

      {/* Category and tags (new topic only) */}
      {(showCategoryField || showTagsField) && (
        <div className="flex flex-wrap gap-4 border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
          {showCategoryField && (
            <div className="min-w-[200px] flex-1">
              <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Category
              </span>
              <CategorySelector
                value={selectedCategoryId}
                onChange={setSelectedCategoryId}
                disabled={isSubmitting}
              />
            </div>
          )}
          {showTagsField && (
            <div className="min-w-[250px] flex-1">
              <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Tags
              </span>
              <TagInput
                value={tags}
                onChange={setTags}
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      {!showPreview && (
        <ComposerToolbar onInsert={handleInsert} disabled={isSubmitting} />
      )}

      {/* Editor / Preview */}
      <div className="flex-1 p-4">
        {showPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <MarkdownEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            disabled={isSubmitting}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-zinc-700">
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {draft && "Draft saved"}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (!content.trim() && (mode !== "new-topic" || !title.trim()))
            }
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {mode === "new-topic"
                  ? "Create Topic"
                  : mode === "reply"
                    ? "Post Reply"
                    : "Save Edit"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
