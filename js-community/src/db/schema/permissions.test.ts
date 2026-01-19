/**
 * Tests for permission schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type Badge,
  badges,
  type NewBadge,
  type NewPermissionType,
  type NewPostActionType,
  type NewTrustLevelGrant,
  type NewUserActionType,
  type NewUserBadge,
  type PermissionType,
  type PostActionType,
  permissionTypes,
  postActionTypes,
  type TrustLevelGrant,
  trustLevelGrants,
  type UserActionType,
  type UserBadge,
  userActionTypes,
  userBadges,
} from "./permissions";

describe("Permissions Schema", () => {
  describe("permissionTypes table", () => {
    it("should have correct table name", () => {
      expect(permissionTypes).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(permissionTypes[Symbol.for("drizzle:Name")]).toBe(
        "permission_types",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(permissionTypes);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("value");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have optional fields", () => {
      const columns = Object.keys(permissionTypes);
      expect(columns).toContain("description");
    });
  });

  describe("userActionTypes table", () => {
    it("should have correct table name", () => {
      expect(userActionTypes).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(userActionTypes[Symbol.for("drizzle:Name")]).toBe(
        "user_action_types",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(userActionTypes);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have optional fields", () => {
      const columns = Object.keys(userActionTypes);
      expect(columns).toContain("description");
    });
  });

  describe("postActionTypes table", () => {
    it("should have correct table name", () => {
      expect(postActionTypes).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(postActionTypes[Symbol.for("drizzle:Name")]).toBe(
        "post_action_types",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(postActionTypes);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have action configuration fields", () => {
      const columns = Object.keys(postActionTypes);
      expect(columns).toContain("isFlag");
      expect(columns).toContain("icon");
      expect(columns).toContain("position");
      expect(columns).toContain("scoreBonus");
    });
  });

  describe("trustLevelGrants table", () => {
    it("should have correct table name", () => {
      expect(trustLevelGrants).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(trustLevelGrants[Symbol.for("drizzle:Name")]).toBe(
        "trust_level_grants",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(trustLevelGrants);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("trustLevel");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have audit fields", () => {
      const columns = Object.keys(trustLevelGrants);
      expect(columns).toContain("grantedById");
      expect(columns).toContain("reason");
    });
  });

  describe("userBadges table", () => {
    it("should have correct table name", () => {
      expect(userBadges).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(userBadges[Symbol.for("drizzle:Name")]).toBe("user_badges");
    });

    it("should have required fields", () => {
      const columns = Object.keys(userBadges);
      expect(columns).toContain("id");
      expect(columns).toContain("badgeId");
      expect(columns).toContain("userId");
      expect(columns).toContain("grantedAt");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have grant tracking fields", () => {
      const columns = Object.keys(userBadges);
      expect(columns).toContain("grantedById");
      expect(columns).toContain("postId");
      expect(columns).toContain("notificationId");
      expect(columns).toContain("seq");
      expect(columns).toContain("featured");
    });
  });

  describe("badges table", () => {
    it("should have correct table name", () => {
      expect(badges).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(badges[Symbol.for("drizzle:Name")]).toBe("badges");
    });

    it("should have required fields", () => {
      const columns = Object.keys(badges);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("badgeTypeId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have configuration fields", () => {
      const columns = Object.keys(badges);
      expect(columns).toContain("grantCount");
      expect(columns).toContain("allowTitle");
      expect(columns).toContain("multiple");
      expect(columns).toContain("listable");
      expect(columns).toContain("enabled");
      expect(columns).toContain("autoRevoke");
      expect(columns).toContain("system");
    });

    it("should have display fields", () => {
      const columns = Object.keys(badges);
      expect(columns).toContain("description");
      expect(columns).toContain("icon");
      expect(columns).toContain("imageUrl");
      expect(columns).toContain("longDescription");
    });
  });

  describe("TypeScript types", () => {
    it("should define PermissionType type", () => {
      const permissionType: PermissionType = {
        id: 1,
        name: "full",
        description: "Full access",
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(permissionType).toBeDefined();
    });

    it("should define NewPermissionType type", () => {
      const newPermissionType: NewPermissionType = {
        name: "readonly",
        value: 2,
      };
      expect(newPermissionType).toBeDefined();
    });

    it("should define UserActionType type", () => {
      const userActionType: UserActionType = {
        id: 1,
        name: "like",
        description: "User liked a post",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(userActionType).toBeDefined();
    });

    it("should define NewUserActionType type", () => {
      const newUserActionType: NewUserActionType = {
        name: "bookmark",
      };
      expect(newUserActionType).toBeDefined();
    });

    it("should define PostActionType type", () => {
      const postActionType: PostActionType = {
        id: 1,
        name: "like",
        description: "Like a post",
        isFlag: 0,
        icon: "heart",
        position: 1,
        scoreBonus: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(postActionType).toBeDefined();
    });

    it("should define NewPostActionType type", () => {
      const newPostActionType: NewPostActionType = {
        name: "flag",
      };
      expect(newPostActionType).toBeDefined();
    });

    it("should define TrustLevelGrant type", () => {
      const trustLevelGrant: TrustLevelGrant = {
        id: 1,
        userId: 1,
        trustLevel: 2,
        grantedById: null,
        reason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(trustLevelGrant).toBeDefined();
    });

    it("should define NewTrustLevelGrant type", () => {
      const newTrustLevelGrant: NewTrustLevelGrant = {
        userId: 1,
        trustLevel: 3,
      };
      expect(newTrustLevelGrant).toBeDefined();
    });

    it("should define UserBadge type", () => {
      const userBadge: UserBadge = {
        id: 1,
        badgeId: 1,
        userId: 1,
        grantedById: null,
        grantedAt: new Date(),
        postId: null,
        notificationId: null,
        seq: 0,
        featured: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(userBadge).toBeDefined();
    });

    it("should define NewUserBadge type", () => {
      const newUserBadge: NewUserBadge = {
        badgeId: 1,
        userId: 1,
      };
      expect(newUserBadge).toBeDefined();
    });

    it("should define Badge type", () => {
      const badge: Badge = {
        id: 1,
        name: "Editor",
        description: "First post edit",
        badgeTypeId: 3,
        grantCount: 0,
        allowTitle: 0,
        multiple: 0,
        icon: "pencil-alt",
        listable: 1,
        targetPosts: 0,
        enabled: 1,
        autoRevoke: 1,
        badgeGroupingId: 5,
        system: 0,
        imageUrl: null,
        longDescription: null,
        showPosts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(badge).toBeDefined();
    });

    it("should define NewBadge type", () => {
      const newBadge: NewBadge = {
        name: "Contributor",
        badgeTypeId: 1,
      };
      expect(newBadge).toBeDefined();
    });
  });
});
