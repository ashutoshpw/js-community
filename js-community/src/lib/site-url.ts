import { headers } from "next/headers";

const LOCALHOST_URL = "http://localhost:3000";

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export async function getAppBaseUrl(): Promise<string> {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (configuredUrl) {
    const baseUrl = configuredUrl.startsWith("http")
      ? configuredUrl
      : `https://${configuredUrl}`;
    return normalizeBaseUrl(baseUrl);
  }

  if (process.env.VERCEL_URL) {
    return `https://${normalizeBaseUrl(process.env.VERCEL_URL)}`;
  }

  try {
    const requestHeaders = await headers();
    const host =
      requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "https";

    if (host) {
      return `${protocol}://${normalizeBaseUrl(host)}`;
    }
  } catch {
    // Ignore missing request context and fall back to localhost.
  }

  return LOCALHOST_URL;
}

export async function buildAppUrl(path: string): Promise<string> {
  const baseUrl = await getAppBaseUrl();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
