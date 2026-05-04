/**
 * Tests for asset URL rewrite utilities
 */

import { describe, expect, it } from "vitest";
import {
  avatarBlobKey,
  expandAvatarUrl,
  extractDiscourseUrls,
  rewriteCooked,
  rewriteRaw,
  type UrlMap,
  uploadBlobKey,
} from "./url-rewrite";

// ---------------------------------------------------------------------------
// expandAvatarUrl
// ---------------------------------------------------------------------------

describe("expandAvatarUrl", () => {
  it("replaces {size} with default 240", () => {
    const result = expandAvatarUrl(
      "/user_avatar/forum.example.com/alice/{size}/2_2.png",
    );
    expect(result).toBe("/user_avatar/forum.example.com/alice/240/2_2.png");
  });

  it("replaces {size} with a custom size", () => {
    const result = expandAvatarUrl(
      "/user_avatar/forum.example.com/alice/{size}/2_2.png",
      48,
    );
    expect(result).toBe("/user_avatar/forum.example.com/alice/48/2_2.png");
  });

  it("replaces multiple {size} occurrences", () => {
    const tpl = "/avatar/{size}/img/{size}.png";
    expect(expandAvatarUrl(tpl, 100)).toBe("/avatar/100/img/100.png");
  });

  it("returns template unchanged when no {size} placeholder", () => {
    const url = "/user_avatar/forum.example.com/alice/240/2_2.png";
    expect(expandAvatarUrl(url)).toBe(url);
  });
});

// ---------------------------------------------------------------------------
// avatarBlobKey / uploadBlobKey
// ---------------------------------------------------------------------------

describe("avatarBlobKey", () => {
  it("produces deterministic key", () => {
    expect(avatarBlobKey(42, "abc123", ".png")).toBe("avatars/42/abc123.png");
  });

  it("strips leading dot from ext", () => {
    expect(avatarBlobKey(1, "hash", ".jpg")).toBe("avatars/1/hash.jpg");
  });

  it("defaults to jpg when ext is empty", () => {
    expect(avatarBlobKey(1, "hash", "")).toBe("avatars/1/hash.jpg");
  });
});

describe("uploadBlobKey", () => {
  it("produces deterministic key", () => {
    expect(uploadBlobKey(7, "deadbeef", ".gif")).toBe("uploads/7/deadbeef.gif");
  });

  it("defaults to bin when ext is empty", () => {
    expect(uploadBlobKey(7, "deadbeef", "")).toBe("uploads/7/deadbeef.bin");
  });
});

// ---------------------------------------------------------------------------
// rewriteRaw
// ---------------------------------------------------------------------------

describe("rewriteRaw", () => {
  it("replaces a known URL", () => {
    const urlMap: UrlMap = new Map([
      [
        "/uploads/default/original/1.jpg",
        "https://blob.example.com/uploads/1.jpg",
      ],
    ]);
    const raw = "See this image: /uploads/default/original/1.jpg end";
    expect(rewriteRaw(raw, urlMap)).toBe(
      "See this image: https://blob.example.com/uploads/1.jpg end",
    );
  });

  it("replaces all occurrences", () => {
    const urlMap: UrlMap = new Map([["/uploads/a.png", "https://cdn/a.png"]]);
    const raw = "![a](/uploads/a.png) and ![b](/uploads/a.png)";
    const result = rewriteRaw(raw, urlMap);
    expect(result.split("https://cdn/a.png").length - 1).toBe(2);
  });

  it("leaves unmatched URLs alone", () => {
    const urlMap: UrlMap = new Map([["/uploads/x.png", "https://cdn/x.png"]]);
    const raw = "No match here: /uploads/y.png";
    expect(rewriteRaw(raw, urlMap)).toBe("No match here: /uploads/y.png");
  });

  it("returns original string when urlMap is empty", () => {
    const raw = "some content";
    expect(rewriteRaw(raw, new Map())).toBe("some content");
  });
});

// ---------------------------------------------------------------------------
// rewriteCooked (HTML)
// ---------------------------------------------------------------------------

describe("rewriteCooked", () => {
  it("rewrites src attributes in img tags", () => {
    const urlMap: UrlMap = new Map([
      ["/uploads/img.png", "https://blob.example.com/img.png"],
    ]);
    const cooked = '<img src="/uploads/img.png" alt="x">';
    expect(rewriteCooked(cooked, urlMap)).toBe(
      '<img src="https://blob.example.com/img.png" alt="x">',
    );
  });

  it("rewrites href attributes in anchor tags", () => {
    const urlMap: UrlMap = new Map([
      ["/uploads/file.pdf", "https://blob.example.com/file.pdf"],
    ]);
    const cooked = '<a href="/uploads/file.pdf">Download</a>';
    expect(rewriteCooked(cooked, urlMap)).toBe(
      '<a href="https://blob.example.com/file.pdf">Download</a>',
    );
  });
});

// ---------------------------------------------------------------------------
// extractDiscourseUrls
// ---------------------------------------------------------------------------

describe("extractDiscourseUrls", () => {
  it("extracts markdown image URLs", () => {
    const raw = "![pic](/uploads/default/original/foo.jpg)";
    const urls = extractDiscourseUrls(raw);
    expect(urls).toContain("/uploads/default/original/foo.jpg");
  });

  it("extracts avatar URLs", () => {
    const raw = "![avatar](/user_avatar/forum.example.com/alice/240/2.png)";
    const urls = extractDiscourseUrls(raw);
    expect(urls).toContain("/user_avatar/forum.example.com/alice/240/2.png");
  });

  it("does not include external URLs", () => {
    const raw = "![ext](https://external.com/image.png)";
    expect(extractDiscourseUrls(raw)).toHaveLength(0);
  });

  it("deduplicates repeated URLs", () => {
    const raw = "/uploads/a.png and /uploads/a.png again";
    const urls = extractDiscourseUrls(raw);
    const count = urls.filter((u) => u === "/uploads/a.png").length;
    expect(count).toBe(1);
  });

  it("extracts bare upload paths", () => {
    const raw = "See /uploads/short-url/abc123.png for details";
    const urls = extractDiscourseUrls(raw);
    expect(urls.some((u) => u.startsWith("/uploads/"))).toBe(true);
  });
});
