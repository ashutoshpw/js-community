/**
 * Tests for password reset request API route
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Mock modules
vi.mock("@/lib/database", () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

vi.mock("@/db/schema", () => ({
  users: {
    id: "id",
    email: "email",
  },
}));

vi.mock("@/lib/password-reset", () => ({
  createPasswordResetToken: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  recordAttempt: vi.fn(),
}));

/**
 * Helper to create NextRequest for testing
 */
function createNextRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("POST /api/password-reset/request", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Default mock for rate limiting (allow)
    const { checkRateLimit } = vi.mocked(await import("@/lib/rate-limit"));
    checkRateLimit.mockReturnValue({ allowed: true, remainingAttempts: 2 });
  });

  it("should return 400 when email is invalid", async () => {
    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "invalid-email" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("valid email");
  });

  it("should return 400 when email is missing", async () => {
    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      {},
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("required");
  });

  it("should return 429 when IP is rate limited", async () => {
    const { checkRateLimit } = vi.mocked(await import("@/lib/rate-limit"));
    checkRateLimit.mockReturnValueOnce({
      allowed: false,
      blockedUntil: new Date(Date.now() + 3600000),
    });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "test@example.com" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain("Too many password reset requests");
  });

  it("should return 429 when email is rate limited", async () => {
    const { checkRateLimit } = vi.mocked(await import("@/lib/rate-limit"));
    checkRateLimit
      .mockReturnValueOnce({ allowed: true, remainingAttempts: 2 })
      .mockReturnValueOnce({
        allowed: false,
        blockedUntil: new Date(Date.now() + 3600000),
      });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "test@example.com" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain("Too many password reset requests");
  });

  it("should record rate limit attempts", async () => {
    const { db } = await import("@/lib/database");
    const { recordAttempt } = vi.mocked(await import("@/lib/rate-limit"));

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "test@example.com" },
    );

    await POST(request);

    expect(recordAttempt).toHaveBeenCalledTimes(2);
    expect(recordAttempt).toHaveBeenCalledWith(expect.stringContaining("ip:"));
    expect(recordAttempt).toHaveBeenCalledWith("email:test@example.com");
  });

  it("should return 200 when user does not exist (prevent enumeration)", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "nonexistent@example.com" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("If an account exists");
  });

  it("should create token and return 200 when user exists", async () => {
    const { db } = await import("@/lib/database");
    const { createPasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 123,
              email: "test@example.com",
            },
          ]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);
    createPasswordResetToken.mockResolvedValue("test-token-123");

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "test@example.com" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("If an account exists");
    expect(createPasswordResetToken).toHaveBeenCalledWith(123);
  });

  it("should handle database errors gracefully", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/request",
      { email: "test@example.com" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("error occurred");
  });
});
