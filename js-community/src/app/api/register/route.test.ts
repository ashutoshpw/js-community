/**
 * Tests for register API route
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Mock the database module
vi.mock("@/lib/database", () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

// Mock the users schema
vi.mock("@/db/schema", () => ({
  users: {
    id: "id",
    username: "username",
    email: "email",
  },
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

describe("POST /api/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when name is invalid", async () => {
    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "",
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("should return 400 when username is invalid", async () => {
    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "ab",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("at least 3 characters");
  });

  it("should return 400 when email is invalid", async () => {
    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "invalid-email",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("valid email");
  });

  it("should return 400 when password is invalid", async () => {
    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "weak",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("at least 8 characters");
  });

  it("should return 400 when username is already taken", async () => {
    const { db } = await import("@/lib/database");
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "existinguser",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Username is already taken");
  });

  it("should return 400 when email is already registered", async () => {
    const { db } = await import("@/lib/database");

    let callCount = 0;
    const mockSelect = vi.fn().mockImplementation(() => ({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi
            .fn()
            .mockResolvedValue(callCount++ === 0 ? [] : [{ id: 1 }]),
        }),
      }),
    }));

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "existing@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email is already registered");
  });

  it("should create user and return 201 when all data is valid", async () => {
    const { db } = await import("@/lib/database");
    const mockFetch = vi.mocked(global.fetch);

    // Mock username and email availability checks (both available)
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    // Mock successful better-auth sign-up
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, email: "test@example.com" } }),
    } as Response);

    // Mock database update for username
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate);

    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Registration successful");
    expect(data.user.username).toBe("testuser");
    expect(data.user.email).toBe("test@example.com");
  });

  it("should handle better-auth sign-up failure", async () => {
    const { db } = await import("@/lib/database");
    const mockFetch = vi.mocked(global.fetch);

    // Mock username and email availability checks
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    // Mock failed better-auth sign-up
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Email already exists in auth" }),
    } as Response);

    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email already exists in auth");
  });

  it("should handle unexpected errors gracefully", async () => {
    const { db } = await import("@/lib/database");

    // Mock database error
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("Database connection failed");
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest("http://localhost:3000/api/register", {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("An unexpected error occurred during registration");
  });
});
