/**
 * robots.txt generation
 *
 * Allows all public pages and disallows admin, API, and auth routes.
 */

import type { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getAppBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/forum/messages/",
          "/forum/u/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
