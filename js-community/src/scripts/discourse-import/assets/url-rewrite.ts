/**
 * Discourse Import — Asset URL rewrite utilities
 *
 * Rewrites Discourse-hosted image/upload URLs in raw markdown and cooked HTML
 * to point to the newly-migrated Blob storage URLs.
 *
 * Discourse asset URL patterns:
 *   - Avatars:  /user_avatar/<host>/<username>/{size}/<version>_<revision>.png
 *               (the `{size}` placeholder is literal in some contexts)
 *   - Uploads:  /uploads/<site>/original/<bucket>/<hash>.<ext>
 *               /uploads/<site>/optimized/<...>
 *   - Short:    /uploads/short-url/<base62>.ext
 */

/** Map of original Discourse URL (normalised) -> new Blob URL */
export type UrlMap = Map<string, string>;

/**
 * Expand a Discourse avatar URL template by replacing the `{size}` placeholder
 * with a concrete pixel size (default 240 for high-dpi).
 */
export function expandAvatarUrl(template: string, size = 240): string {
  return template.replace(/\{size\}/g, String(size));
}

/**
 * Derive a deterministic Blob storage key for an avatar asset.
 *   avatars/<legacyUserId>/<sha256prefix>.<ext>
 */
export function avatarBlobKey(
  legacyUserId: number,
  hash: string,
  ext: string,
): string {
  const safeExt = ext.replace(/^\./, "").toLowerCase() || "jpg";
  return `avatars/${legacyUserId}/${hash}.${safeExt}`;
}

/**
 * Derive a deterministic Blob storage key for a general upload asset.
 *   uploads/<legacyUploadId>/<sha256prefix>.<ext>
 */
export function uploadBlobKey(
  legacyUploadId: number,
  hash: string,
  ext: string,
): string {
  const safeExt = ext.replace(/^\./, "").toLowerCase() || "bin";
  return `uploads/${legacyUploadId}/${hash}.${safeExt}`;
}

/**
 * Rewrite all known Discourse asset URLs in a markdown/raw string.
 *
 * The urlMap maps original (as-stored) URL strings to new Blob URLs.
 * Partial matches (e.g. the avatar template without size) are also replaced
 * so that every size variant resolves to the same migrated asset.
 */
export function rewriteRaw(raw: string, urlMap: UrlMap): string {
  let out = raw;
  for (const [original, replacement] of urlMap) {
    // Escape for use in regex
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(escaped, "g"), replacement);
  }
  return out;
}

/**
 * Rewrite all known Discourse asset URLs in cooked HTML.
 * Handles both `src="..."` and `href="..."` attributes plus bare URLs in text.
 */
export function rewriteCooked(cooked: string, urlMap: UrlMap): string {
  // Re-use the same logic — URLs appear as attribute values or plain text
  return rewriteRaw(cooked, urlMap);
}

/**
 * Extract all Discourse upload/avatar URL candidates from a raw markdown string.
 * Returns unique normalised URL strings for use as fetch targets.
 */
export function extractDiscourseUrls(raw: string): string[] {
  const patterns = [
    // Markdown images: ![alt](url)
    /!\[.*?\]\(([^)]+)\)/g,
    // Markdown links: [text](url)
    /\[.*?\]\(([^)]+)\)/g,
    // HTML src/href
    /(?:src|href)="([^"]+)"/g,
    // Bare upload paths
    /(\/uploads\/[^\s"')\]]+)/g,
    // Bare avatar paths
    /(\/user_avatar\/[^\s"')\]]+)/g,
  ];

  const found = new Set<string>();
  for (const re of patterns) {
    let match: RegExpExecArray | null;
    // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
    while ((match = re.exec(raw)) !== null) {
      const url = match[1];
      if (
        url &&
        (url.startsWith("/uploads/") || url.startsWith("/user_avatar/"))
      ) {
        found.add(url);
      }
    }
  }
  return Array.from(found);
}
