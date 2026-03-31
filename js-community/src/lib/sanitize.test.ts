/**
 * Tests for HTML sanitization utilities
 */

import { describe, expect, it } from "vitest";
import {
  sanitizeHtml,
  sanitizeHtmlWithSecureLinks,
  stripHtml,
} from "@/lib/sanitize";

describe("sanitize", () => {
  describe("sanitizeHtml", () => {
    it("should return empty string for null/undefined input", () => {
      expect(sanitizeHtml("")).toBe("");
      expect(sanitizeHtml(null as unknown as string)).toBe("");
      expect(sanitizeHtml(undefined as unknown as string)).toBe("");
    });

    it("should allow safe HTML tags", () => {
      const html = "<p>Hello <strong>world</strong></p>";
      expect(sanitizeHtml(html)).toBe("<p>Hello <strong>world</strong></p>");
    });

    it("should allow headings", () => {
      const html = "<h1>Title</h1><h2>Subtitle</h2>";
      expect(sanitizeHtml(html)).toBe("<h1>Title</h1><h2>Subtitle</h2>");
    });

    it("should allow lists", () => {
      const html = "<ul><li>Item 1</li><li>Item 2</li></ul>";
      expect(sanitizeHtml(html)).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
    });

    it("should allow links with href", () => {
      const html = '<a href="https://example.com">Link</a>';
      expect(sanitizeHtml(html)).toContain('href="https://example.com"');
    });

    it("should allow images with src and alt", () => {
      const html = '<img src="image.jpg" alt="Test">';
      const result = sanitizeHtml(html);
      expect(result).toContain('src="image.jpg"');
      expect(result).toContain('alt="Test"');
    });

    it("should remove script tags", () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      expect(sanitizeHtml(html)).toBe("<p>Hello</p>");
    });

    it("should remove style tags", () => {
      const html = "<p>Hello</p><style>body { color: red; }</style>";
      expect(sanitizeHtml(html)).toBe("<p>Hello</p>");
    });

    it("should remove iframe tags", () => {
      const html = '<p>Hello</p><iframe src="evil.com"></iframe>';
      expect(sanitizeHtml(html)).toBe("<p>Hello</p>");
    });

    it("should remove form tags", () => {
      const html = "<form><input type=\"text\"></form>";
      expect(sanitizeHtml(html)).toBe("");
    });

    it("should remove onclick handlers", () => {
      const html = '<p onclick="alert(1)">Click me</p>';
      expect(sanitizeHtml(html)).toBe("<p>Click me</p>");
    });

    it("should remove onerror handlers", () => {
      const html = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHtml(html);
      expect(result).not.toContain("onerror");
    });

    it("should remove onload handlers", () => {
      const html = '<img src="x" onload="alert(1)">';
      const result = sanitizeHtml(html);
      expect(result).not.toContain("onload");
    });

    it("should allow class attributes", () => {
      const html = '<p class="text-red-500">Styled text</p>';
      expect(sanitizeHtml(html)).toContain('class="text-red-500"');
    });

    it("should allow code blocks", () => {
      const html = "<pre><code>const x = 1;</code></pre>";
      expect(sanitizeHtml(html)).toBe("<pre><code>const x = 1;</code></pre>");
    });

    it("should allow tables", () => {
      const html =
        "<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>";
      expect(sanitizeHtml(html)).toContain("<table>");
      expect(sanitizeHtml(html)).toContain("<th>Header</th>");
    });
  });

  describe("sanitizeHtmlWithSecureLinks", () => {
    it("should add rel attribute to links without it", () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtmlWithSecureLinks(html);
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it("should not duplicate rel attribute if already present", () => {
      const html = '<a href="https://example.com" rel="nofollow">Link</a>';
      const result = sanitizeHtmlWithSecureLinks(html);
      // Should keep existing rel and not add another
      expect(result).toContain("rel=");
      expect((result.match(/rel=/g) || []).length).toBe(1);
    });

    it("should sanitize HTML and add secure links", () => {
      const html =
        '<a href="https://example.com">Safe</a><script>alert("xss")</script>';
      const result = sanitizeHtmlWithSecureLinks(html);
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).not.toContain("script");
    });

    it("should return empty string for null/undefined input", () => {
      expect(sanitizeHtmlWithSecureLinks("")).toBe("");
      expect(sanitizeHtmlWithSecureLinks(null as unknown as string)).toBe("");
    });
  });

  describe("stripHtml", () => {
    it("should return empty string for null/undefined input", () => {
      expect(stripHtml("")).toBe("");
      expect(stripHtml(null as unknown as string)).toBe("");
      expect(stripHtml(undefined as unknown as string)).toBe("");
    });

    it("should remove all HTML tags", () => {
      const html = "<p>Hello <strong>world</strong></p>";
      expect(stripHtml(html)).toBe("Hello world");
    });

    it("should handle nested tags", () => {
      const html = "<div><p><span>Nested</span> content</p></div>";
      expect(stripHtml(html)).toBe("Nested content");
    });

    it("should strip script content entirely", () => {
      const html = '<p>Text</p><script>alert("xss")</script>';
      const result = stripHtml(html);
      expect(result).not.toContain("alert");
    });

    it("should preserve text content", () => {
      const html = "<h1>Title</h1><p>Paragraph with <em>emphasis</em></p>";
      expect(stripHtml(html)).toBe("TitleParagraph with emphasis");
    });
  });
});
