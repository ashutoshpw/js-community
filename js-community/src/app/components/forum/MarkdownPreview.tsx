/**
 * MarkdownPreview component
 *
 * Renders markdown content as HTML with styling.
 */

"use client";

import { useEffect, useState } from "react";
import { parseMarkdownAsync } from "@/lib/markdown";

interface MarkdownPreviewProps {
  content: string;
  minHeight?: string;
  maxHeight?: string;
}

export function MarkdownPreview({
  content,
  minHeight = "150px",
  maxHeight = "400px",
}: MarkdownPreviewProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!content.trim()) {
      setHtml("");
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    parseMarkdownAsync(content)
      .then((result) => {
        if (!cancelled) {
          setHtml(result);
        }
      })
      .catch((error) => {
        console.error("Failed to parse markdown:", error);
        if (!cancelled) {
          setHtml(`<p class="text-red-500">Failed to preview content</p>`);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (!content.trim()) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-gray-500"
        style={{ minHeight }}
      >
        Preview will appear here...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        style={{ minHeight }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Rendering preview...
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto rounded-md border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
      style={{ minHeight, maxHeight }}
    >
      <div
        className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none dark:prose-a:text-blue-400 dark:prose-code:bg-zinc-700"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized by marked
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
