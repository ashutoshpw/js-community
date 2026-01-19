/**
 * Tests for group schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type Group,
  type GroupHistory,
  type GroupMention,
  type GroupUser,
  groupHistories,
  groupMentions,
  groups,
  groupUsers,
  type NewGroup,
  type NewGroupHistory,
  type NewGroupMention,
  type NewGroupUser,
} from "./groups";

describe("Groups Schema", () => {
  describe("groups table", () => {
    it("should have correct table name", () => {
      expect(groups).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(groups[Symbol.for("drizzle:Name")]).toBe("groups");
    });

    it("should have required fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have display fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("displayName");
      expect(columns).toContain("fullName");
      expect(columns).toContain("bioRaw");
      expect(columns).toContain("bioCooked");
    });

    it("should have visibility and access fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("visibility");
      expect(columns).toContain("public");
      expect(columns).toContain("mentionableLevel");
      expect(columns).toContain("messagableLevel");
      expect(columns).toContain("membersVisibilityLevel");
    });

    it("should have membership fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("allowMembershipRequests");
      expect(columns).toContain("membershipRequestTemplate");
      expect(columns).toContain("userCount");
      expect(columns).toContain("automaticMembershipEmailDomains");
      expect(columns).toContain("automaticMembershipRetroactive");
    });

    it("should have flair customization fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("flairUrl");
      expect(columns).toContain("flairBgColor");
      expect(columns).toContain("flairColor");
    });

    it("should have permission and feature fields", () => {
      const columns = Object.keys(groups);
      expect(columns).toContain("primaryGroup");
      expect(columns).toContain("title");
      expect(columns).toContain("grantTrustLevel");
      expect(columns).toContain("canAdminGroup");
      expect(columns).toContain("hasMessages");
      expect(columns).toContain("publishReadState");
    });
  });

  describe("groupUsers table", () => {
    it("should have correct table name", () => {
      expect(groupUsers).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(groupUsers[Symbol.for("drizzle:Name")]).toBe("group_users");
    });

    it("should have required fields", () => {
      const columns = Object.keys(groupUsers);
      expect(columns).toContain("id");
      expect(columns).toContain("groupId");
      expect(columns).toContain("userId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have membership role fields", () => {
      const columns = Object.keys(groupUsers);
      expect(columns).toContain("owner");
      expect(columns).toContain("notificationLevel");
      expect(columns).toContain("firstUnreadPmAt");
    });
  });

  describe("groupMentions table", () => {
    it("should have correct table name", () => {
      expect(groupMentions).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(groupMentions[Symbol.for("drizzle:Name")]).toBe("group_mentions");
    });

    it("should have required fields", () => {
      const columns = Object.keys(groupMentions);
      expect(columns).toContain("id");
      expect(columns).toContain("postId");
      expect(columns).toContain("groupId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("groupHistories table", () => {
    it("should have correct table name", () => {
      expect(groupHistories).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(groupHistories[Symbol.for("drizzle:Name")]).toBe(
        "group_histories",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(groupHistories);
      expect(columns).toContain("id");
      expect(columns).toContain("groupId");
      expect(columns).toContain("actingUserId");
      expect(columns).toContain("action");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have audit fields", () => {
      const columns = Object.keys(groupHistories);
      expect(columns).toContain("targetUserId");
      expect(columns).toContain("subject");
      expect(columns).toContain("prevValue");
      expect(columns).toContain("newValue");
    });
  });

  describe("TypeScript types", () => {
    it("should define Group type", () => {
      const group: Group = {
        id: 1,
        name: "moderators",
        displayName: "Moderators",
        bioRaw: "Site moderators",
        bioCooked: "<p>Site moderators</p>",
        visibility: 0,
        public: true,
        allowMembershipRequests: false,
        membershipRequestTemplate: null,
        fullName: "Site Moderators",
        userCount: 5,
        mentionableLevel: 0,
        messagableLevel: 0,
        flairUrl: null,
        flairBgColor: null,
        flairColor: null,
        primaryGroup: false,
        title: null,
        grantTrustLevel: null,
        incomingEmail: null,
        hasMessages: false,
        publishReadState: false,
        membersVisibilityLevel: 0,
        canAdminGroup: false,
        defaultNotificationLevel: 3,
        automaticMembershipEmailDomains: null,
        automaticMembershipRetroactive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(group).toBeDefined();
    });

    it("should define NewGroup type", () => {
      const newGroup: NewGroup = {
        name: "admins",
      };
      expect(newGroup).toBeDefined();
    });

    it("should define GroupUser type", () => {
      const groupUser: GroupUser = {
        id: 1,
        groupId: 1,
        userId: 1,
        owner: false,
        notificationLevel: 2,
        firstUnreadPmAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(groupUser).toBeDefined();
    });

    it("should define NewGroupUser type", () => {
      const newGroupUser: NewGroupUser = {
        groupId: 1,
        userId: 1,
      };
      expect(newGroupUser).toBeDefined();
    });

    it("should define GroupMention type", () => {
      const groupMention: GroupMention = {
        id: 1,
        postId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(groupMention).toBeDefined();
    });

    it("should define NewGroupMention type", () => {
      const newGroupMention: NewGroupMention = {
        postId: 1,
        groupId: 1,
      };
      expect(newGroupMention).toBeDefined();
    });

    it("should define GroupHistory type", () => {
      const groupHistory: GroupHistory = {
        id: 1,
        groupId: 1,
        actingUserId: 1,
        targetUserId: null,
        action: 1,
        subject: "Added user",
        prevValue: null,
        newValue: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(groupHistory).toBeDefined();
    });

    it("should define NewGroupHistory type", () => {
      const newGroupHistory: NewGroupHistory = {
        groupId: 1,
        actingUserId: 1,
        action: 1,
      };
      expect(newGroupHistory).toBeDefined();
    });
  });
});
