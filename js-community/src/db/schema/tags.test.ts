/**
 * Tests for tag schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type CategoryTag,
  categoryTags,
  type NewCategoryTag,
  type NewTag,
  type NewTagGroup,
  type NewTagGroupMembership,
  type NewTagUser,
  type NewTopicTag,
  type Tag,
  type TagGroup,
  type TagGroupMembership,
  type TagUser,
  type TopicTag,
  tagGroupMemberships,
  tagGroups,
  tags,
  tagUsers,
  topicTags,
} from "./tags";

describe("Tags Schema", () => {
  describe("tags table", () => {
    it("should have correct table name", () => {
      expect(tags).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(tags[Symbol.for("drizzle:Name")]).toBe("tags");
    });

    it("should have required fields", () => {
      const columns = Object.keys(tags);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("topicCount");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have optional fields", () => {
      const columns = Object.keys(tags);
      expect(columns).toContain("description");
      expect(columns).toContain("targetTagId");
      expect(columns).toContain("pmTopicCount");
    });
  });

  describe("tagGroups table", () => {
    it("should have correct table name", () => {
      expect(tagGroups).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(tagGroups[Symbol.for("drizzle:Name")]).toBe("tag_groups");
    });

    it("should have required fields", () => {
      const columns = Object.keys(tagGroups);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have grouping fields", () => {
      const columns = Object.keys(tagGroups);
      expect(columns).toContain("parentTagId");
      expect(columns).toContain("onePerTopic");
    });
  });

  describe("tagGroupMemberships table", () => {
    it("should have correct table name", () => {
      expect(tagGroupMemberships).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(tagGroupMemberships[Symbol.for("drizzle:Name")]).toBe(
        "tag_group_memberships",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(tagGroupMemberships);
      expect(columns).toContain("id");
      expect(columns).toContain("tagId");
      expect(columns).toContain("tagGroupId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("topicTags table", () => {
    it("should have correct table name", () => {
      expect(topicTags).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(topicTags[Symbol.for("drizzle:Name")]).toBe("topic_tags");
    });

    it("should have required fields", () => {
      const columns = Object.keys(topicTags);
      expect(columns).toContain("id");
      expect(columns).toContain("topicId");
      expect(columns).toContain("tagId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("categoryTags table", () => {
    it("should have correct table name", () => {
      expect(categoryTags).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(categoryTags[Symbol.for("drizzle:Name")]).toBe("category_tags");
    });

    it("should have required fields", () => {
      const columns = Object.keys(categoryTags);
      expect(columns).toContain("id");
      expect(columns).toContain("categoryId");
      expect(columns).toContain("tagId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("tagUsers table", () => {
    it("should have correct table name", () => {
      expect(tagUsers).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(tagUsers[Symbol.for("drizzle:Name")]).toBe("tag_users");
    });

    it("should have required fields", () => {
      const columns = Object.keys(tagUsers);
      expect(columns).toContain("id");
      expect(columns).toContain("tagId");
      expect(columns).toContain("userId");
      expect(columns).toContain("notificationLevel");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("TypeScript types", () => {
    it("should define Tag type", () => {
      const tag: Tag = {
        id: 1,
        name: "javascript",
        topicCount: 0,
        pmTopicCount: 0,
        targetTagId: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(tag).toBeDefined();
    });

    it("should define NewTag type", () => {
      const newTag: NewTag = {
        name: "typescript",
      };
      expect(newTag).toBeDefined();
    });

    it("should define TagGroup type", () => {
      const tagGroup: TagGroup = {
        id: 1,
        name: "Programming Languages",
        parentTagId: null,
        onePerTopic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(tagGroup).toBeDefined();
    });

    it("should define NewTagGroup type", () => {
      const newTagGroup: NewTagGroup = {
        name: "Frameworks",
      };
      expect(newTagGroup).toBeDefined();
    });

    it("should define TagGroupMembership type", () => {
      const membership: TagGroupMembership = {
        id: 1,
        tagId: 1,
        tagGroupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(membership).toBeDefined();
    });

    it("should define NewTagGroupMembership type", () => {
      const newMembership: NewTagGroupMembership = {
        tagId: 1,
        tagGroupId: 1,
      };
      expect(newMembership).toBeDefined();
    });

    it("should define TopicTag type", () => {
      const topicTag: TopicTag = {
        id: 1,
        topicId: 1,
        tagId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(topicTag).toBeDefined();
    });

    it("should define NewTopicTag type", () => {
      const newTopicTag: NewTopicTag = {
        topicId: 1,
        tagId: 1,
      };
      expect(newTopicTag).toBeDefined();
    });

    it("should define CategoryTag type", () => {
      const categoryTag: CategoryTag = {
        id: 1,
        categoryId: 1,
        tagId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(categoryTag).toBeDefined();
    });

    it("should define NewCategoryTag type", () => {
      const newCategoryTag: NewCategoryTag = {
        categoryId: 1,
        tagId: 1,
      };
      expect(newCategoryTag).toBeDefined();
    });

    it("should define TagUser type", () => {
      const tagUser: TagUser = {
        id: 1,
        tagId: 1,
        userId: 1,
        notificationLevel: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(tagUser).toBeDefined();
    });

    it("should define NewTagUser type", () => {
      const newTagUser: NewTagUser = {
        tagId: 1,
        userId: 1,
      };
      expect(newTagUser).toBeDefined();
    });
  });
});
