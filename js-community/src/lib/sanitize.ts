/**
 * HTML Sanitization utilities
 *
 * This module provides functions for sanitizing HTML content
 * to prevent XSS attacks using DOMPurify.
 */

import DOMPurify, { type Config } from "dompurify";

/**
 * Default DOMPurify configuration for safe HTML rendering
 */
const DEFAULT_CONFIG: Config = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "em",
    "strong",
    "del",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div",
    "sup",
    "sub",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "title",
    "class",
    "id",
    "target",
    "rel",
    "width",
    "height",
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target"],
  // Force links to open in new tab with security attributes
  FORBID_TAGS: ["script", "style", "iframe", "form", "input", "button"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
};

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * @param html - Raw HTML string to sanitize
 * @param config - Optional custom DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string, config: Config = {}): string {
  if (!html) return "";

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const sanitized = DOMPurify.sanitize(html, mergedConfig);

  return typeof sanitized === "string" ? sanitized : "";
}

/**
 * Sanitize HTML and add rel="noopener noreferrer" to external links
 *
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string with secure links
 */
export function sanitizeHtmlWithSecureLinks(html: string): string {
  if (!html) return "";

  // First sanitize
  let sanitized = sanitizeHtml(html);

  // Add security attributes to links that don't already have them
  sanitized = sanitized.replace(/<a\s+([^>]*href=[^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes("rel=")) {
      return `<a ${attrs} rel="noopener noreferrer">`;
    }
    return match;
  });

  return sanitized;
}

/**
 * Strip all HTML tags and return plain text
 *
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return typeof sanitized === "string" ? sanitized : "";
}
