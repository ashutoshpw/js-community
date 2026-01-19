/**
 * Tests for topic schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type NewTopic,
  type NewTopicUser,
  type Topic,
  type TopicUser,
  topicUsers,
  topics,
} from "./topics";

describe("Topics Schema", () => {
  describe("topics table", () => {
    it("should have correct table name", () => {
      expect(topics).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(topics[Symbol.for("drizzle:Name")]).toBe("topics");
    });

    it("should have required fields", () => {
      const columns = Object.keys(topics);
      expect(columns).toContain("id");
      expect(columns).toContain("title");
      expect(columns).toContain("slug");
      expect(columns).toContain("userId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have engagement metrics", () => {
      const columns = Object.keys(topics);
      expect(columns).toContain("views");
      expect(columns).toContain("postsCount");
      expect(columns).toContain("replyCount");
      expect(columns).toContain("likeCount");
    });

    it("should have pinning functionality fields", () => {
      const columns = Object.keys(topics);
      expect(columns).toContain("pinned");
      expect(columns).toContain("pinnedAt");
      expect(columns).toContain("pinnedGlobally");
      expect(columns).toContain("pinnedUntil");
    });

    it("should have status flags", () => {
      const columns = Object.keys(topics);
      expect(columns).toContain("visible");
      expect(columns).toContain("closed");
      expect(columns).toContain("archived");
    });

    it("should have timestamp tracking", () => {
      const columns = Object.keys(topics);
      expect(columns).toContain("lastPostedAt");
      expect(columns).toContain("lastReplyAt");
      expect(columns).toContain("bumpedAt");
    });
  });

  describe("topicUsers table", () => {
    it("should have correct table name", () => {
      expect(topicUsers).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(topicUsers[Symbol.for("drizzle:Name")]).toBe("topic_users");
    });

    it("should have required fields", () => {
      const columns = Object.keys(topicUsers);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("topicId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have reading progress tracking", () => {
      const columns = Object.keys(topicUsers);
      expect(columns).toContain("lastReadPostNumber");
      expect(columns).toContain("highestSeenPostNumber");
      expect(columns).toContain("lastVisitedAt");
      expect(columns).toContain("firstVisitedAt");
    });

    it("should have notification settings", () => {
      const columns = Object.keys(topicUsers);
      expect(columns).toContain("notificationLevel");
      expect(columns).toContain("notificationsChanged");
      expect(columns).toContain("notificationsReasonId");
    });

    it("should have engagement flags", () => {
      const columns = Object.keys(topicUsers);
      expect(columns).toContain("posted");
      expect(columns).toContain("liked");
      expect(columns).toContain("bookmarked");
    });
  });

  describe("TypeScript types", () => {
    it("should define Topic type", () => {
      const topic: Topic = {
        id: 1,
        title: "Test Topic",
        slug: "test-topic",
        userId: 1,
        categoryId: null,
        views: 0,
        postsCount: 1,
        replyCount: 0,
        likeCount: 0,
        highestPostNumber: 1,
        lastPostedAt: null,
        lastReplyAt: null,
        bumpedAt: null,
        pinned: false,
        pinnedAt: null,
        pinnedGlobally: false,
        pinnedUntil: null,
        visible: true,
        closed: false,
        closedAt: null,
        archived: false,
        archivedAt: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(topic).toBeDefined();
    });

    it("should define NewTopic type", () => {
      const newTopic: NewTopic = {
        title: "New Topic",
        slug: "new-topic",
        userId: 1,
      };
      expect(newTopic).toBeDefined();
    });

    it("should define TopicUser type", () => {
      const topicUser: TopicUser = {
        id: 1,
        userId: 1,
        topicId: 1,
        posted: false,
        lastReadPostNumber: 0,
        highestSeenPostNumber: 0,
        lastVisitedAt: null,
        firstVisitedAt: null,
        notificationLevel: 1,
        notificationsChanged: false,
        notificationsReasonId: null,
        liked: false,
        bookmarked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(topicUser).toBeDefined();
    });

    it("should define NewTopicUser type", () => {
      const newTopicUser: NewTopicUser = {
        userId: 1,
        topicId: 1,
      };
      expect(newTopicUser).toBeDefined();
    });
  });
});
