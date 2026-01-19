/**
 * Tests for username availability check API
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock the database module
vi.mock("@/lib/database", () => ({
  db: {
    select: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  sql: vi.fn(),
}));

// Mock the users schema
vi.mock("@/db/schema", () => ({
  users: {
    id: "id",
    username: "username",
  },
}));

/**
 * Helper to create NextRequest for testing
 */
function createNextRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("GET /api/users/check-username", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when username parameter is missing", async () => {
    const request = createNextRequest(
      "http://localhost:3000/api/users/check-username",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Username parameter is required");
  });

  it("should return validation error for invalid username format", async () => {
    const request = createNextRequest(
      "http://localhost:3000/api/users/check-username?username=ab",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(false);
    expect(data.error).toBeDefined();
  });

  it("should return available=true when username is not taken", async () => {
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
      "http://localhost:3000/api/users/check-username?username=newuser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(true);
    expect(data.error).toBeUndefined();
  });

  it("should return available=false when username is taken", async () => {
    const { db } = await import("@/lib/database");
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest(
      "http://localhost:3000/api/users/check-username?username=existinguser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(false);
    expect(data.error).toBe("Username is already taken");
  });

  it("should handle database errors gracefully", async () => {
    const { db } = await import("@/lib/database");
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockRejectedValue(new Error("Database error")),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const request = createNextRequest(
      "http://localhost:3000/api/users/check-username?username=testuser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to check username availability");
  });
});
