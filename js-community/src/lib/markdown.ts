/**
 * Markdown parsing utilities
 *
 * This module provides functions for converting markdown to HTML
 * using the marked library with safe defaults.
 */

import { marked } from "marked";

/**
 * Configure marked with safe defaults
 */
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
});

/**
 * Parse markdown to HTML
 *
 * @param markdown - Raw markdown string
 * @returns HTML string
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";
  const result = marked.parse(markdown);
  // marked.parse can return string or Promise<string>, we handle sync case
  if (typeof result === "string") {
    return result;
  }
  // For async case, return empty string (caller should use parseMarkdownAsync)
  return "";
}

/**
 * Parse markdown to HTML (async version)
 *
 * @param markdown - Raw markdown string
 * @returns Promise resolving to HTML string
 */
export async function parseMarkdownAsync(markdown: string): Promise<string> {
  if (!markdown) return "";
  return await marked.parse(markdown);
}

/**
 * Strip markdown formatting to get plain text
 * Useful for excerpts and previews
 *
 * @param markdown - Raw markdown string
 * @returns Plain text string
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return "";

  return (
    markdown
      // Remove headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      // Remove links, keep text
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      // Remove images
      .replace(/!\[.*?\]\(.+?\)/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`(.+?)`/g, "$1")
      // Remove blockquotes
      .replace(/^>\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, "")
      // Normalize whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Truncate text to a maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default 150)
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength = 150): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Create an excerpt from markdown content
 *
 * @param markdown - Raw markdown string
 * @param maxLength - Maximum length (default 150)
 * @returns Plain text excerpt
 */
export function createExcerpt(markdown: string, maxLength = 150): string {
  const plainText = stripMarkdown(markdown);
  return truncateText(plainText, maxLength);
}
