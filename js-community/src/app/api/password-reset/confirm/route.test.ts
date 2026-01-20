/**
 * Tests for password reset confirm API route
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Mock modules
vi.mock("@/lib/password-reset", () => ({
  validatePasswordResetToken: vi.fn(),
  markTokenAsUsed: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

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

describe("POST /api/password-reset/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when password is invalid", async () => {
    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "valid-token", password: "weak" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("at least 8 characters");
  });

  it("should return 400 when token is invalid", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    validatePasswordResetToken.mockResolvedValue({
      valid: false,
      error: "Invalid token",
    });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "invalid-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid token");
  });

  it("should return 400 when token is expired", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    validatePasswordResetToken.mockResolvedValue({
      valid: false,
      error: "Token has expired",
    });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "expired-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Token has expired");
  });

  it("should return 400 when token is already used", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    validatePasswordResetToken.mockResolvedValue({
      valid: false,
      error: "Token has already been used",
    });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "used-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Token has already been used");
  });

  it("should return 400 when userId is missing from token validation", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    validatePasswordResetToken.mockResolvedValue({
      valid: true,
      // userId is missing
    });

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "valid-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid token");
  });

  it("should reset password successfully", async () => {
    const { validatePasswordResetToken, markTokenAsUsed } = vi.mocked(
      await import("@/lib/password-reset"),
    );
    const mockFetch = vi.mocked(global.fetch);

    validatePasswordResetToken.mockResolvedValue({
      valid: true,
      userId: 123,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Password reset successful" }),
    } as Response);

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "valid-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Password has been reset successfully");
    expect(markTokenAsUsed).toHaveBeenCalledWith("valid-token");
  });

  it("should handle better-auth API errors", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );
    const mockFetch = vi.mocked(global.fetch);

    validatePasswordResetToken.mockResolvedValue({
      valid: true,
      userId: 123,
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "User not found" }),
    } as Response);

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "valid-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("User not found");
  });

  it("should handle unexpected errors gracefully", async () => {
    const { validatePasswordResetToken } = vi.mocked(
      await import("@/lib/password-reset"),
    );

    validatePasswordResetToken.mockRejectedValue(new Error("Database error"));

    const request = createNextRequest(
      "http://localhost:3000/api/password-reset/confirm",
      { token: "valid-token", password: "ValidPass123!" },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("error occurred");
  });
});
