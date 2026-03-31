/**
 * Tests for environment variable validation
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = process.env;

describe("env validation", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("validateEnv", () => {
    it("should return valid when all required variables are present", async () => {
      process.env.DATABASE_URL = "postgres://localhost:5432/test";
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.NODE_ENV = "development";

      const { validateEnv } = await import("@/lib/env");
      const result = validateEnv();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for missing required variables", async () => {
      process.env.DATABASE_URL = "";
      process.env.BETTER_AUTH_SECRET = "";
      process.env.NODE_ENV = "development";

      const { validateEnv } = await import("@/lib/env");
      const result = validateEnv();

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("DATABASE_URL"))).toBe(true);
    });

    it("should return warnings for production-only variables in development", async () => {
      process.env.DATABASE_URL = "postgres://localhost:5432/test";
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.NODE_ENV = "development";
      process.env.RESEND_API_KEY = "";
      process.env.EMAIL_FROM = "";

      const { validateEnv } = await import("@/lib/env");
      const result = validateEnv();

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes("RESEND_API_KEY"))).toBe(
        true,
      );
    });

    it("should return errors for production-only variables missing in production", async () => {
      process.env.DATABASE_URL = "postgres://localhost:5432/test";
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.NODE_ENV = "production";
      process.env.RESEND_API_KEY = "";
      process.env.EMAIL_FROM = "";

      const { validateEnv } = await import("@/lib/env");
      const result = validateEnv();

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("RESEND_API_KEY"))).toBe(
        true,
      );
      expect(result.errors.some((e) => e.includes("EMAIL_FROM"))).toBe(true);
    });
  });

  describe("assertEnv", () => {
    it("should not throw when all required variables are present", async () => {
      process.env.DATABASE_URL = "postgres://localhost:5432/test";
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.NODE_ENV = "development";

      const { assertEnv } = await import("@/lib/env");

      expect(() => assertEnv()).not.toThrow();
    });

    it("should throw when required variables are missing", async () => {
      process.env.DATABASE_URL = "";
      process.env.BETTER_AUTH_SECRET = "";
      process.env.NODE_ENV = "development";

      const { assertEnv } = await import("@/lib/env");

      expect(() => assertEnv()).toThrow("Environment validation failed");
    });

    it("should log warnings for non-critical missing variables", async () => {
      process.env.DATABASE_URL = "postgres://localhost:5432/test";
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.NODE_ENV = "development";
      process.env.RESEND_API_KEY = "";

      const { assertEnv } = await import("@/lib/env");
      assertEnv();

      // Logger outputs via console.log in test environment
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("getEnv", () => {
    it("should return the value when variable exists", async () => {
      process.env.TEST_VAR = "test-value";

      const { getEnv } = await import("@/lib/env");
      const value = getEnv("TEST_VAR");

      expect(value).toBe("test-value");
    });

    it("should throw when variable is missing", async () => {
      process.env.TEST_VAR = "";

      const { getEnv } = await import("@/lib/env");

      expect(() => getEnv("TEST_VAR")).toThrow(
        "Missing required environment variable",
      );
    });

    it("should throw when variable is only whitespace", async () => {
      process.env.TEST_VAR = "   ";

      const { getEnv } = await import("@/lib/env");

      expect(() => getEnv("TEST_VAR")).toThrow(
        "Missing required environment variable",
      );
    });
  });

  describe("getEnvOrDefault", () => {
    it("should return the value when variable exists", async () => {
      process.env.TEST_VAR = "test-value";

      const { getEnvOrDefault } = await import("@/lib/env");
      const value = getEnvOrDefault("TEST_VAR", "default");

      expect(value).toBe("test-value");
    });

    it("should return default when variable is missing", async () => {
      process.env.TEST_VAR = "";

      const { getEnvOrDefault } = await import("@/lib/env");
      const value = getEnvOrDefault("TEST_VAR", "default");

      expect(value).toBe("default");
    });

    it("should return default when variable is only whitespace", async () => {
      process.env.TEST_VAR = "   ";

      const { getEnvOrDefault } = await import("@/lib/env");
      const value = getEnvOrDefault("TEST_VAR", "default");

      expect(value).toBe("default");
    });
  });
});
