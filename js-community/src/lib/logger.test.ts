/**
 * Tests for structured logging utility
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock process.env before importing
const originalEnv = process.env;

describe("logger", () => {
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

  describe("log levels", () => {
    it("should log debug messages in development", async () => {
      process.env.NODE_ENV = "development";
      const { logger } = await import("@/lib/logger");

      logger.debug("Test debug message");

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("[DEBUG]"),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Test debug message"),
      );
    });

    it("should skip debug messages in production", async () => {
      process.env.NODE_ENV = "production";
      const { logger } = await import("@/lib/logger");

      logger.debug("Test debug message");

      expect(console.log).not.toHaveBeenCalled();
    });

    it("should log info messages", async () => {
      process.env.NODE_ENV = "production";
      const { logger } = await import("@/lib/logger");

      logger.info("Test info message");

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("[INFO]"),
      );
    });

    it("should log warn messages", async () => {
      const { logger } = await import("@/lib/logger");

      logger.warn("Test warn message");

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("[WARN]"),
      );
    });

    it("should log error messages", async () => {
      const { logger } = await import("@/lib/logger");

      logger.error("Test error message");

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR]"),
      );
    });
  });

  describe("log data", () => {
    it("should include data in log output", async () => {
      const { logger } = await import("@/lib/logger");

      logger.info("Test message", { key: "value" });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"key":"value"'),
      );
    });

    it("should not include data object when empty", async () => {
      const { logger } = await import("@/lib/logger");

      logger.info("Test message");

      const call = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(call).not.toContain("{}");
    });
  });

  describe("exception logging", () => {
    it("should log Error instances with name and message", async () => {
      const { logger } = await import("@/lib/logger");
      const error = new Error("Test error");

      logger.exception("An error occurred", error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Test error"),
      );
    });

    it("should handle non-Error values", async () => {
      const { logger } = await import("@/lib/logger");

      logger.exception("An error occurred", "string error");

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("string error"),
      );
    });

    it("should include additional data with exceptions", async () => {
      const { logger } = await import("@/lib/logger");
      const error = new Error("Test error");

      logger.exception("An error occurred", error, { requestId: "123" });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("requestId"),
      );
    });
  });

  describe("child logger", () => {
    it("should include default data in all logs", async () => {
      const { logger } = await import("@/lib/logger");
      const childLogger = logger.child({ service: "test-service" });

      childLogger.info("Test message");

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test-service"),
      );
    });

    it("should merge additional data with default data", async () => {
      const { logger } = await import("@/lib/logger");
      const childLogger = logger.child({ service: "test-service" });

      childLogger.info("Test message", { action: "test-action" });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test-service"),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test-action"),
      );
    });

    it("should support nested child loggers", async () => {
      const { logger } = await import("@/lib/logger");
      const childLogger = logger.child({ service: "test-service" });
      const nestedChild = childLogger.child({ component: "test-component" });

      nestedChild.info("Test message");

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test-service"),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test-component"),
      );
    });

    it("should support exception logging in child loggers", async () => {
      const { logger } = await import("@/lib/logger");
      const childLogger = logger.child({ service: "test-service" });
      const error = new Error("Child error");

      childLogger.exception("An error occurred", error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("test-service"),
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Child error"),
      );
    });
  });

  describe("JSON logging", () => {
    it("should output JSON when LOG_FORMAT is json", async () => {
      process.env.LOG_FORMAT = "json";
      const { logger } = await import("@/lib/logger");

      logger.info("Test message", { key: "value" });

      const call = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe("info");
      expect(parsed.message).toBe("Test message");
      expect(parsed.data.key).toBe("value");
    });
  });

  describe("custom log level", () => {
    it("should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "warn";
      const { logger } = await import("@/lib/logger");

      logger.info("Should be skipped");
      logger.warn("Should be logged");

      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
