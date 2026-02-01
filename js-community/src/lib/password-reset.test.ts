/**
 * Tests for password reset token utilities
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanupExpiredTokens,
  createPasswordResetToken,
  generateResetToken,
  markTokenAsUsed,
  validatePasswordResetToken,
} from "./password-reset";

// Mock the database module
vi.mock("@/lib/database", () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
  gt: vi.fn(),
}));

// Mock the schema
vi.mock("@/db/schema", () => ({
  passwordResetTokens: {
    token: "token",
    userId: "userId",
    expiresAt: "expiresAt",
    used: "used",
  },
}));

describe("generateResetToken", () => {
  it("should generate a token of 64 characters (32 bytes hex)", () => {
    const token = generateResetToken();
    expect(token).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it("should generate unique tokens", () => {
    const token1 = generateResetToken();
    const token2 = generateResetToken();
    expect(token1).not.toBe(token2);
  });
});

describe("createPasswordResetToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a password reset token for a user", async () => {
    const { db } = await import("@/lib/database");

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert);

    const token = await createPasswordResetToken(123);

    expect(token).toHaveLength(64);
    expect(db.insert).toHaveBeenCalled();
    expect(mockInsert().values).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 123,
        token: expect.any(String),
        expiresAt: expect.any(Date),
        used: false,
      }),
    );
  });

  it("should set expiry time to 1 hour from now", async () => {
    const { db } = await import("@/lib/database");
    const now = Date.now();

    let capturedExpiresAt: Date | undefined;
    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockImplementation((values) => {
        capturedExpiresAt = values.expiresAt;
        return Promise.resolve({});
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert);

    await createPasswordResetToken(123);

    expect(capturedExpiresAt).toBeDefined();
    if (capturedExpiresAt) {
      const diff = capturedExpiresAt.getTime() - now;
      // Should be approximately 1 hour (with some tolerance for execution time)
      expect(diff).toBeGreaterThan(59 * 60 * 1000);
      expect(diff).toBeLessThan(61 * 60 * 1000);
    }
  });
});

describe("validatePasswordResetToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return invalid when token is empty", async () => {
    const result = await validatePasswordResetToken("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Token is required");
  });

  it("should return invalid when token does not exist", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await validatePasswordResetToken("nonexistent-token");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

  it("should return invalid when token is already used", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              userId: 123,
              token: "valid-token",
              expiresAt: new Date(Date.now() + 60 * 60 * 1000),
              used: true,
            },
          ]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await validatePasswordResetToken("valid-token");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Token has already been used");
  });

  it("should return invalid when token is expired", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              userId: 123,
              token: "valid-token",
              expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
              used: false,
            },
          ]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await validatePasswordResetToken("valid-token");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Token has expired");
  });

  it("should return valid with userId when token is valid", async () => {
    const { db } = await import("@/lib/database");

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              userId: 123,
              token: "valid-token",
              expiresAt: new Date(Date.now() + 60 * 60 * 1000),
              used: false,
            },
          ]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect);

    const result = await validatePasswordResetToken("valid-token");
    expect(result.valid).toBe(true);
    expect(result.userId).toBe(123);
    expect(result.error).toBeUndefined();
  });
});

describe("markTokenAsUsed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mark token as used", async () => {
    const { db } = await import("@/lib/database");

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate);

    await markTokenAsUsed("test-token");

    expect(db.update).toHaveBeenCalled();
    expect(mockUpdate().set).toHaveBeenCalledWith({ used: true });
  });
});

describe("cleanupExpiredTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete expired tokens and return count", async () => {
    const { db } = await import("@/lib/database");

    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]),
      }),
    });

    vi.mocked(db.delete).mockImplementation(mockDelete);

    const result = await cleanupExpiredTokens();

    expect(result).toBe(5);
    expect(db.delete).toHaveBeenCalled();
  });

  it("should return 0 when no tokens are deleted", async () => {
    const { db } = await import("@/lib/database");

    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    });

    vi.mocked(db.delete).mockImplementation(mockDelete);

    const result = await cleanupExpiredTokens();

    expect(result).toBe(0);
  });

  it("should return 0 when result is empty array", async () => {
    const { db } = await import("@/lib/database");

    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    });

    vi.mocked(db.delete).mockImplementation(mockDelete);

    const result = await cleanupExpiredTokens();

    expect(result).toBe(0);
  });
});
