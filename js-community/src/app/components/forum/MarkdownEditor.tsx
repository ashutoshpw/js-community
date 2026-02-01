/**
 * MarkdownEditor component
 *
 * Textarea with markdown editing support.
 */

"use client";

import {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  useCallback,
} from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const MarkdownEditor = forwardRef<
  HTMLTextAreaElement,
  MarkdownEditorProps
>(function MarkdownEditor(
  {
    value,
    onChange,
    placeholder = "Write your post here...\n\nYou can use **bold**, *italic*, and [links](url).",
    minHeight = "150px",
    maxHeight = "400px",
    disabled = false,
    onKeyDown,
  },
  ref,
) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle Tab for indentation
      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const newValue = `${value.substring(0, start)}  ${value.substring(end)}`;
        onChange(newValue);

        // Move cursor after the inserted spaces
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        });
      }

      // Forward other key events
      onKeyDown?.(e);
    },
    [value, onChange, onKeyDown],
  );

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:disabled:bg-zinc-900"
      style={{
        minHeight,
        maxHeight,
      }}
    />
  );
});
