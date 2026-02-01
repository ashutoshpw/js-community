/**
 * TagInput component
 *
 * Input for adding tags to a topic with autocomplete.
 */

"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  maxTags = 5,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const normalizedTag = tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      
      if (
        normalizedTag &&
        !value.includes(normalizedTag) &&
        value.length < maxTags
      ) {
        onChange([...value, normalizedTag]);
      }
      setInputValue("");
    },
    [value, onChange, maxTags]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      }
    },
    [inputValue, value, addTag, removeTag]
  );

  const handleBlur = useCallback(() => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  }, [inputValue, addTag]);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 ${
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900"
          : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400"
      }`}
    >
      {/* Existing tags */}
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {/* Input */}
      {value.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-white dark:placeholder-gray-500"
        />
      )}

      {/* Tag count indicator */}
      {value.length > 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {value.length}/{maxTags}
        </span>
      )}
    </div>
  );
}
