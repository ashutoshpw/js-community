/**
 * ComposerToolbar component
 *
 * Formatting toolbar for the markdown editor.
 */

"use client";

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface ComposerToolbarProps {
  onInsert: (prefix: string, suffix: string, placeholder?: string) => void;
  onUploadImage?: () => void;
  disabled?: boolean;
}

interface ToolConfig {
  icon: typeof Bold;
  label: string;
  prefix: string;
  suffix: string;
  placeholder: string;
}

const toolGroups: ToolConfig[][] = [
  [
    {
      icon: Bold,
      label: "Bold",
      prefix: "**",
      suffix: "**",
      placeholder: "bold text",
    },
    {
      icon: Italic,
      label: "Italic",
      prefix: "_",
      suffix: "_",
      placeholder: "italic text",
    },
    {
      icon: Heading1,
      label: "Heading 1",
      prefix: "# ",
      suffix: "",
      placeholder: "Heading",
    },
    {
      icon: Heading2,
      label: "Heading 2",
      prefix: "## ",
      suffix: "",
      placeholder: "Heading",
    },
  ],
  [
    {
      icon: Quote,
      label: "Quote",
      prefix: "> ",
      suffix: "",
      placeholder: "quote",
    },
    {
      icon: Code,
      label: "Code",
      prefix: "`",
      suffix: "`",
      placeholder: "code",
    },
    {
      icon: LinkIcon,
      label: "Link",
      prefix: "[",
      suffix: "](url)",
      placeholder: "link text",
    },
  ],
  [
    {
      icon: List,
      label: "Bullet List",
      prefix: "- ",
      suffix: "",
      placeholder: "list item",
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      prefix: "1. ",
      suffix: "",
      placeholder: "list item",
    },
  ],
];

export function ComposerToolbar({
  onInsert,
  onUploadImage,
  disabled = false,
}: ComposerToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
      {toolGroups.map((group, groupIndex) => (
        <span key={`group-${group[0].label}`} className="contents">
          {groupIndex > 0 && (
            <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-zinc-600" />
          )}
          {group.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() =>
                  onInsert(tool.prefix, tool.suffix, tool.placeholder)
                }
                disabled={disabled}
                className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                title={tool.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </span>
      ))}

      {/* Image upload button */}
      {onUploadImage && (
        <>
          <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-zinc-600" />
          <button
            type="button"
            onClick={onUploadImage}
            disabled={disabled}
            className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white"
            title="Upload Image"
          >
            <Image className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
