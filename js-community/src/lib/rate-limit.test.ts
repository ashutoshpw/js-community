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
  beforeEach(() => {
    // Clear all rate limits before each test
    clearRateLimit("test@example.com");
    clearRateLimit("192.168.1.1");
  });

  describe("checkRateLimit", () => {
    it("should allow first attempt", () => {
      const result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(2);
    });

    it("should allow attempts within limit", () => {
      recordAttempt("test@example.com");
      const result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(1);
    });

    it("should block after max attempts", () => {
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");

      const result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(false);
      expect(result.blockedUntil).toBeInstanceOf(Date);
    });

    it("should reset after window expires", () => {
      // Mock Date.now to simulate time passing
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000); // 16 minutes later

      recordAttempt("test@example.com");
      recordAttempt("test@example.com");

      const result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(2);

      vi.restoreAllMocks();
    });

    it("should handle different identifiers separately", () => {
      recordAttempt("user1@example.com");
      recordAttempt("user1@example.com");
      recordAttempt("user1@example.com");

      const result1 = checkRateLimit("user1@example.com");
      const result2 = checkRateLimit("user2@example.com");

      expect(result1.allowed).toBe(false);
      expect(result2.allowed).toBe(true);
    });
  });

  describe("recordAttempt", () => {
    it("should record first attempt", () => {
      recordAttempt("test@example.com");
      const result = checkRateLimit("test@example.com");
      expect(result.remainingAttempts).toBe(1);
    });

    it("should increment attempts", () => {
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");
      const result = checkRateLimit("test@example.com");
      expect(result.remainingAttempts).toBe(0);
    });

    it("should reset attempts after window", () => {
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000); // 16 minutes later

      recordAttempt("test@example.com");
      recordAttempt("test@example.com");

      const result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe("clearRateLimit", () => {
    it("should clear rate limit for identifier", () => {
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");

      let result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(false);

      clearRateLimit("test@example.com");

      result = checkRateLimit("test@example.com");
      expect(result.allowed).toBe(true);
    });
  });

  describe("cleanupRateLimitStore", () => {
    it("should remove expired entries", () => {
      const now = Date.now();
      vi.spyOn(Date, "now")
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 16 * 60 * 1000); // 16 minutes later

      recordAttempt("test@example.com");
      recordAttempt("expired@example.com");

      const cleaned = cleanupRateLimitStore();
      expect(cleaned).toBeGreaterThan(0);

      vi.restoreAllMocks();
    });

    it("should remove unblocked entries after block expires", () => {
      const now = Date.now();
      const dateSpy = vi.spyOn(Date, "now");

      // Initial time for all record attempts and check
      dateSpy.mockReturnValue(now);

      // Create blocked entry
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");
      recordAttempt("test@example.com");
      checkRateLimit("test@example.com"); // Trigger block

      // Move time forward past block duration (61 minutes)
      dateSpy.mockReturnValue(now + 61 * 60 * 1000);

      const cleaned = cleanupRateLimitStore();
      expect(cleaned).toBeGreaterThanOrEqual(1);

      vi.restoreAllMocks();
    });

    it("should return 0 when no entries to clean", () => {
      const cleaned = cleanupRateLimitStore();
      expect(cleaned).toBe(0);
    });
  });
});
