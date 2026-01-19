/**
 * Tests for user schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type NewUser,
  type NewUserEmail,
  type NewUserProfile,
  type User,
  type UserEmail,
  type UserProfile,
  userEmails,
  userProfiles,
  users,
} from "./users";

describe("Users Schema", () => {
  describe("users table", () => {
    it("should have correct table name", () => {
      expect(users).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(users[Symbol.for("drizzle:Name")]).toBe("users");
    });

    it("should have required fields", () => {
      const columns = Object.keys(users);
      expect(columns).toContain("id");
      expect(columns).toContain("username");
      expect(columns).toContain("email");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have admin and moderator flags", () => {
      const columns = Object.keys(users);
      expect(columns).toContain("admin");
      expect(columns).toContain("moderator");
    });

    it("should have trust level and status fields", () => {
      const columns = Object.keys(users);
      expect(columns).toContain("trustLevel");
      expect(columns).toContain("active");
      expect(columns).toContain("approved");
      expect(columns).toContain("suspended");
      expect(columns).toContain("silenced");
    });
  });

  describe("userEmails table", () => {
    it("should have correct table name", () => {
      expect(userEmails).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(userEmails[Symbol.for("drizzle:Name")]).toBe("user_emails");
    });

    it("should have required fields", () => {
      const columns = Object.keys(userEmails);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("email");
      expect(columns).toContain("primary");
      expect(columns).toContain("confirmed");
    });
  });

  describe("userProfiles table", () => {
    it("should have correct table name", () => {
      expect(userProfiles).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(userProfiles[Symbol.for("drizzle:Name")]).toBe("user_profiles");
    });

    it("should have required fields", () => {
      const columns = Object.keys(userProfiles);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("bioRaw");
      expect(columns).toContain("bioCooked");
      expect(columns).toContain("avatarUrl");
    });

    it("should have profile customization fields", () => {
      const columns = Object.keys(userProfiles);
      expect(columns).toContain("location");
      expect(columns).toContain("website");
      expect(columns).toContain("profileBackgroundUrl");
      expect(columns).toContain("cardBackgroundUrl");
    });
  });

  describe("TypeScript types", () => {
    it("should define User type", () => {
      const user: User = {
        id: 1,
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        admin: false,
        moderator: false,
        trustLevel: 0,
        active: true,
        approved: true,
        suspended: false,
        silenced: false,
        suspendedAt: null,
        suspendedTill: null,
        silencedTill: null,
        lastSeenAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(user).toBeDefined();
    });

    it("should define NewUser type", () => {
      const newUser: NewUser = {
        username: "newuser",
        email: "new@example.com",
      };
      expect(newUser).toBeDefined();
    });

    it("should define UserEmail type", () => {
      const userEmail: UserEmail = {
        id: 1,
        userId: 1,
        email: "test@example.com",
        primary: true,
        confirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(userEmail).toBeDefined();
    });

    it("should define NewUserEmail type", () => {
      const newUserEmail: NewUserEmail = {
        userId: 1,
        email: "new@example.com",
      };
      expect(newUserEmail).toBeDefined();
    });

    it("should define UserProfile type", () => {
      const profile: UserProfile = {
        id: 1,
        userId: 1,
        location: "San Francisco",
        website: "https://example.com",
        bioRaw: "Hello",
        bioCooked: "<p>Hello</p>",
        avatarUrl: "https://example.com/avatar.jpg",
        profileBackgroundUrl: null,
        cardBackgroundUrl: null,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(profile).toBeDefined();
    });

    it("should define NewUserProfile type", () => {
      const newProfile: NewUserProfile = {
        userId: 1,
        bioRaw: "Hello world",
      };
      expect(newProfile).toBeDefined();
    });
  });
});
