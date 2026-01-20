/**
 * Tests for user profile API routes
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PATCH } from "./route";

// Mock dependencies
vi.mock("@/lib/database", () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
  },
}));

vi.mock("@/lib/session", () => ({
  getServerSession: vi.fn(),
}));

import { db } from "@/lib/database";
import { getServerSession } from "@/lib/session";

describe("GET /api/users/[username]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user profile with badges", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      name: "Test User",
      email: "test@example.com",
      trustLevel: 1,
      admin: false,
      moderator: false,
      active: true,
      suspended: false,
      createdAt: new Date(),
      lastSeenAt: new Date(),
      profileId: 1,
      location: "San Francisco",
      website: "https://example.com",
      bioRaw: "Hello world",
      bioCooked: "<p>Hello world</p>",
      avatarUrl: "https://example.com/avatar.jpg",
      profileBackgroundUrl: null,
      cardBackgroundUrl: null,
      views: 10,
    };

    const mockBadges = [
      {
        id: 1,
        badgeId: 1,
        grantedAt: new Date(),
        featured: 1,
        badgeName: "First Post",
        badgeDescription: "Made your first post",
        badgeIcon: "star",
        badgeImageUrl: null,
      },
    ];

    // Mock user query
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockUser]),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    // Mock badges query
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        innerJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockBadges),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    // Mock profile views update
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    } as ReturnType<typeof db.update>);

    const request = new Request("http://localhost:3000/api/users/testuser");
    const params = Promise.resolve({ username: "testuser" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user.username).toBe("testuser");
    expect(data.profile.location).toBe("San Francisco");
    expect(data.badges).toHaveLength(1);
    expect(data.badges[0].badgeName).toBe("First Post");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/nonexistent");
    const params = Promise.resolve({ username: "nonexistent" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("should increment profile views", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      profileId: 1,
      views: 10,
      name: "Test User",
      email: "test@example.com",
      trustLevel: 1,
      admin: false,
      moderator: false,
      active: true,
      suspended: false,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockUser]),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        innerJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const updateMock = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });

    vi.mocked(db.update).mockReturnValue({
      set: updateMock,
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/testuser");
    const params = Promise.resolve({ username: "testuser" });

    await GET(request, { params });

    expect(db.update).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/testuser");
    const params = Promise.resolve({ username: "testuser" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch user profile");
  });
});

describe("PATCH /api/users/[username]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update own profile successfully", async () => {
    const mockSession = {
      user: { id: 1, username: "testuser" },
    };

    // biome-ignore lint/suspicious/noExplicitAny: Test mock
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const mockUser = {
      id: 1,
      username: "testuser",
    };

    // Mock user lookup
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    // Mock existing profile check
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const updateUserMock = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });

    const updateProfileMock = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });

    vi.mocked(db.update)
      .mockReturnValueOnce({ set: updateUserMock } as ReturnType<
        typeof db.update
      >)
      .mockReturnValueOnce({ set: updateProfileMock } as ReturnType<
        typeof db.update
      >);

    const request = new Request("http://localhost:3000/api/users/testuser", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        name: "Updated Name",
        location: "New York",
        bioRaw: "Updated bio",
      }),
    });

    const params = Promise.resolve({ username: "testuser" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(updateUserMock).toHaveBeenCalled();
    expect(updateProfileMock).toHaveBeenCalled();
  });

  it("should create profile if it doesn't exist", async () => {
    const mockSession = {
      user: { id: 1, username: "testuser" },
    };

    // biome-ignore lint/suspicious/noExplicitAny: Test mock
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const mockUser = {
      id: 1,
      username: "testuser",
    };

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    // No existing profile
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const insertMock = vi.fn().mockResolvedValue(undefined);
    vi.mocked(db.insert).mockReturnValue({
      values: insertMock,
    } as ReturnType<typeof db.insert>);

    const request = new Request("http://localhost:3000/api/users/testuser", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        location: "Boston",
      }),
    });

    const params = Promise.resolve({ username: "testuser" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(insertMock).toHaveBeenCalled();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/users/testuser", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: "Updated" }),
    });

    const params = Promise.resolve({ username: "testuser" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when trying to update another user's profile", async () => {
    const mockSession = {
      user: { id: 2, username: "otheruser" },
    };

    vi.mocked(getServerSession).mockResolvedValue(
      mockSession as Parameters<typeof getServerSession>[0] & {
        user: { id: number };
      },
    );

    const mockUser = {
      id: 1,
      username: "testuser",
    };

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/testuser", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: "Hacked" }),
    });

    const params = Promise.resolve({ username: "testuser" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("You can only update your own profile");
  });

  it("should return 404 when user not found", async () => {
    const mockSession = {
      user: { id: 1, username: "testuser" },
    };

    vi.mocked(getServerSession).mockResolvedValue(
      mockSession as Parameters<typeof getServerSession>[0] & {
        user: { id: number };
      },
    );

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/nonexistent", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: "Updated" }),
    });

    const params = Promise.resolve({ username: "nonexistent" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("should handle database errors gracefully", async () => {
    const mockSession = {
      user: { id: 1, username: "testuser" },
    };

    vi.mocked(getServerSession).mockResolvedValue(
      mockSession as Parameters<typeof getServerSession>[0] & {
        user: { id: number };
      },
    );

    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockRejectedValue(new Error("Database error")),
        }),
      }),
    } as ReturnType<typeof db.select>);

    const request = new Request("http://localhost:3000/api/users/testuser", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: "Updated" }),
    });

    const params = Promise.resolve({ username: "testuser" });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to update user profile");
  });
});
