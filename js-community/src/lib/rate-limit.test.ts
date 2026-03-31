/**
 * Tests for rate limiting utilities
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkRateLimit,
  cleanupRateLimitStore,
  clearRateLimit,
  recordAttempt,
} from "./rate-limit";

describe("Rate Limiting", () => {
  beforeEach(async () => {
    await clearRateLimit("test@example.com");
    await clearRateLimit("192.168.1.1");
    await clearRateLimit("user1@example.com");
    await clearRateLimit("user2@example.com");
    await clearRateLimit("expired@example.com");
  });

  describe("checkRateLimit", () => {
    it("should allow first attempt", async () => {
      const result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(2);
    });

    it("should allow attempts within limit", async () => {
      await recordAttempt("test@example.com");
      const result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(1);
    });

    it("should block after max attempts", async () => {
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");

      const result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(false);
      expect(result.blockedUntil).toBeInstanceOf(Date);
    });

    it("should reset after window expires", async () => {
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000);

      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");

      const result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(2);

      vi.restoreAllMocks();
    });

    it("should handle different identifiers separately", async () => {
      await recordAttempt("user1@example.com");
      await recordAttempt("user1@example.com");
      await recordAttempt("user1@example.com");

      const result1 = await checkRateLimit("user1@example.com");
      const result2 = await checkRateLimit("user2@example.com");

      expect(result1.allowed).toBe(false);
      expect(result2.allowed).toBe(true);
    });
  });

  describe("recordAttempt", () => {
    it("should record first attempt", async () => {
      await recordAttempt("test@example.com");
      const result = await checkRateLimit("test@example.com");
      expect(result.remainingAttempts).toBe(1);
    });

    it("should increment attempts", async () => {
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");
      const result = await checkRateLimit("test@example.com");
      expect(result.remainingAttempts).toBe(0);
    });

    it("should reset attempts after window", async () => {
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000);

      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");

      const result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe("clearRateLimit", () => {
    it("should clear rate limit for identifier", async () => {
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");

      let result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(false);

      await clearRateLimit("test@example.com");

      result = await checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
    });
  });

  describe("cleanupRateLimitStore", () => {
    it("should remove expired entries", async () => {
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000);

      await recordAttempt("test@example.com");
      await recordAttempt("expired@example.com");

      const cleaned = await cleanupRateLimitStore();
      expect(cleaned).toBeGreaterThan(0);

      vi.restoreAllMocks();
    });

    it("should remove unblocked entries after block expires", async () => {
      const now = Date.now();
      const dateSpy = vi.spyOn(Date, "now");

      dateSpy.mockReturnValue(now);

      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");
      await recordAttempt("test@example.com");
      await checkRateLimit("test@example.com");

      dateSpy.mockReturnValue(now + 61 * 60 * 1000);

      const cleaned = await cleanupRateLimitStore();
      expect(cleaned).toBeGreaterThanOrEqual(1);

      vi.restoreAllMocks();
    });

    it("should return 0 when no entries to clean", async () => {
      const cleaned = await cleanupRateLimitStore();
      expect(cleaned).toBe(0);
    });
  });
});
