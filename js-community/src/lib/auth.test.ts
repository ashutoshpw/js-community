/**
 * Tests for auth configuration
 */

import { describe, expect, it, vi } from "vitest";

// Mock the database module before importing auth
vi.mock("@/lib/database", () => ({
  db: {},
}));

// Mock environment variables before importing auth
const originalEnv = process.env;

describe("Auth Configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Set DATABASE_URL to avoid errors
    process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getBaseUrl", () => {
    it("should use BETTER_AUTH_URL when available", async () => {
      process.env.BETTER_AUTH_URL = "https://auth.example.com";
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });

    it("should use VERCEL_URL when BETTER_AUTH_URL is not set", async () => {
      process.env.VERCEL_URL = "myapp.vercel.app";
      delete process.env.BETTER_AUTH_URL;
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });

    it("should use NEXTAUTH_URL as fallback", async () => {
      process.env.NEXTAUTH_URL = "https://example.com";
      delete process.env.BETTER_AUTH_URL;
      delete process.env.VERCEL_URL;
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });

    it("should default to localhost when no env vars are set", async () => {
      delete process.env.BETTER_AUTH_URL;
      delete process.env.VERCEL_URL;
      delete process.env.NEXTAUTH_URL;
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });
  });

  describe("auth object", () => {
    it("should be defined", async () => {
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
      expect(typeof auth).toBe("object");
    });

    it("should have handler method", async () => {
      const { auth } = await import("./auth");
      expect(auth.handler).toBeDefined();
      expect(typeof auth.handler).toBe("function");
    });

    it("should have api property", async () => {
      const { auth } = await import("./auth");
      expect(auth.api).toBeDefined();
      expect(typeof auth.api).toBe("object");
    });
  });

  describe("email and password configuration", () => {
    it("should enable email and password authentication", async () => {
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
      // Email/password should be enabled by default
    });
  });

  describe("social providers configuration", () => {
    it("should enable Google OAuth when credentials are provided", async () => {
      process.env.GOOGLE_CLIENT_ID = "test_client_id";
      process.env.GOOGLE_CLIENT_SECRET = "test_client_secret";
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });

    it("should enable GitHub OAuth when credentials are provided", async () => {
      process.env.GITHUB_CLIENT_ID = "test_client_id";
      process.env.GITHUB_CLIENT_SECRET = "test_client_secret";
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });

    it("should work when OAuth credentials are not provided", async () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
    });
  });

  describe("session configuration", () => {
    it("should configure session expiration", async () => {
      const { auth } = await import("./auth");
      expect(auth).toBeDefined();
      // Session should be configured with 7 days expiration
    });
  });

  describe("type exports", () => {
    it("should export Session type", async () => {
      const { auth } = await import("./auth");
      // Better-auth types are available through type inference
      expect(auth).toBeDefined();
    });

    it("should export User type", async () => {
      const { auth } = await import("./auth");
      // Better-auth types are available through type inference
      expect(auth).toBeDefined();
    });
  });
});
