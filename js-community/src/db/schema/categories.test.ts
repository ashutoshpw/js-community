/**
 * Tests for category schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type Category,
  type CategoryGroup,
  type CategoryUser,
  categories,
  categoryGroups,
  categoryUsers,
  type NewCategory,
  type NewCategoryGroup,
  type NewCategoryUser,
} from "./categories";

describe("Categories Schema", () => {
  describe("categories table", () => {
    it("should have correct table name", () => {
      expect(categories).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(categories[Symbol.for("drizzle:Name")]).toBe("categories");
    });

    it("should have required fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("slug");
      expect(columns).toContain("color");
      expect(columns).toContain("textColor");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have hierarchical fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("parentCategoryId");
      expect(columns).toContain("position");
    });

    it("should have content fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("description");
      expect(columns).toContain("topicId");
      expect(columns).toContain("topicCount");
      expect(columns).toContain("postCount");
    });

    it("should have customization fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("uploadedLogoId");
      expect(columns).toContain("uploadedBackgroundId");
      expect(columns).toContain("defaultView");
      expect(columns).toContain("subcategoryListStyle");
    });

    it("should have permission and settings fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("readRestricted");
      expect(columns).toContain("allowBadges");
      expect(columns).toContain("topicFeaturedLinkAllowed");
      expect(columns).toContain("showSubcategoryList");
    });

    it("should have topic configuration fields", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("autoCloseHours");
      expect(columns).toContain("autoCloseBased");
      expect(columns).toContain("minimumRequiredTags");
      expect(columns).toContain("numFeaturedTopics");
    });
  });

  describe("categoryUsers table", () => {
    it("should have correct table name", () => {
      expect(categoryUsers).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(categoryUsers[Symbol.for("drizzle:Name")]).toBe("category_users");
    });

    it("should have required fields", () => {
      const columns = Object.keys(categoryUsers);
      expect(columns).toContain("id");
      expect(columns).toContain("categoryId");
      expect(columns).toContain("userId");
      expect(columns).toContain("notificationLevel");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have tracking fields", () => {
      const columns = Object.keys(categoryUsers);
      expect(columns).toContain("lastSeenAt");
    });
  });

  describe("categoryGroups table", () => {
    it("should have correct table name", () => {
      expect(categoryGroups).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(categoryGroups[Symbol.for("drizzle:Name")]).toBe(
        "category_groups",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(categoryGroups);
      expect(columns).toContain("id");
      expect(columns).toContain("categoryId");
      expect(columns).toContain("groupId");
      expect(columns).toContain("permissionType");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("TypeScript types", () => {
    it("should define Category type", () => {
      const category: Category = {
        id: 1,
        name: "General",
        slug: "general",
        color: "0088CC",
        textColor: "FFFFFF",
        description: "General discussion topics",
        topicId: null,
        topicCount: 0,
        postCount: 0,
        position: 0,
        parentCategoryId: null,
        uploadedLogoId: null,
        uploadedBackgroundId: null,
        readRestricted: false,
        autoCloseHours: null,
        autoCloseBased: 3,
        allowBadges: true,
        topicFeaturedLinkAllowed: true,
        showSubcategoryList: false,
        numFeaturedTopics: 3,
        defaultView: "latest",
        subcategoryListStyle: "rows_with_featured_topics",
        defaultTopPeriod: "all",
        mailingListMode: false,
        minimumRequiredTags: 0,
        navigateToFirstPostAfterRead: false,
        sortOrder: null,
        sortAscending: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(category).toBeDefined();
    });

    it("should define NewCategory type", () => {
      const newCategory: NewCategory = {
        name: "Tech",
        slug: "tech",
        color: "FF0000",
      };
      expect(newCategory).toBeDefined();
    });

    it("should define CategoryUser type", () => {
      const categoryUser: CategoryUser = {
        id: 1,
        categoryId: 1,
        userId: 1,
        notificationLevel: 1,
        lastSeenAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(categoryUser).toBeDefined();
    });

    it("should define NewCategoryUser type", () => {
      const newCategoryUser: NewCategoryUser = {
        categoryId: 1,
        userId: 1,
      };
      expect(newCategoryUser).toBeDefined();
    });

    it("should define CategoryGroup type", () => {
      const categoryGroup: CategoryGroup = {
        id: 1,
        categoryId: 1,
        groupId: 1,
        permissionType: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(categoryGroup).toBeDefined();
    });

    it("should define NewCategoryGroup type", () => {
      const newCategoryGroup: NewCategoryGroup = {
        categoryId: 1,
        groupId: 1,
      };
      expect(newCategoryGroup).toBeDefined();
    });
  });
});
