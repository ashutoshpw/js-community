/**
 * Tests for post schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type NewPost,
  type NewPostAction,
  type NewPostRevision,
  type Post,
  type PostAction,
  type PostRevision,
  postActions,
  postRevisions,
  posts,
} from "./posts";

describe("Posts Schema", () => {
  describe("posts table", () => {
    it("should have correct table name", () => {
      expect(posts).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(posts[Symbol.for("drizzle:Name")]).toBe("posts");
    });

    it("should have required fields", () => {
      const columns = Object.keys(posts);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("topicId");
      expect(columns).toContain("postNumber");
      expect(columns).toContain("raw");
      expect(columns).toContain("cooked");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have reply tracking fields", () => {
      const columns = Object.keys(posts);
      expect(columns).toContain("replyToPostNumber");
      expect(columns).toContain("replyCount");
    });

    it("should have engagement metrics", () => {
      const columns = Object.keys(posts);
      expect(columns).toContain("likeCount");
      expect(columns).toContain("quoteCount");
      expect(columns).toContain("reads");
      expect(columns).toContain("score");
    });

    it("should have moderation fields", () => {
      const columns = Object.keys(posts);
      expect(columns).toContain("hidden");
      expect(columns).toContain("hiddenAt");
      expect(columns).toContain("hiddenReasonId");
      expect(columns).toContain("deletedAt");
      expect(columns).toContain("deletedById");
    });

    it("should have versioning fields", () => {
      const columns = Object.keys(posts);
      expect(columns).toContain("version");
      expect(columns).toContain("lastVersionAt");
      expect(columns).toContain("wiki");
    });
  });

  describe("postActions table", () => {
    it("should have correct table name", () => {
      expect(postActions).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(postActions[Symbol.for("drizzle:Name")]).toBe("post_actions");
    });

    it("should have required fields", () => {
      const columns = Object.keys(postActions);
      expect(columns).toContain("id");
      expect(columns).toContain("postId");
      expect(columns).toContain("userId");
      expect(columns).toContain("postActionTypeId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have moderation action fields", () => {
      const columns = Object.keys(postActions);
      expect(columns).toContain("staffTookAction");
      expect(columns).toContain("deferredById");
      expect(columns).toContain("deferredAt");
      expect(columns).toContain("agreedAt");
      expect(columns).toContain("agreedById");
      expect(columns).toContain("disagreedAt");
      expect(columns).toContain("disagreedById");
    });

    it("should have deletion tracking", () => {
      const columns = Object.keys(postActions);
      expect(columns).toContain("deletedAt");
      expect(columns).toContain("deletedById");
    });
  });

  describe("postRevisions table", () => {
    it("should have correct table name", () => {
      expect(postRevisions).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(postRevisions[Symbol.for("drizzle:Name")]).toBe("post_revisions");
    });

    it("should have required fields", () => {
      const columns = Object.keys(postRevisions);
      expect(columns).toContain("id");
      expect(columns).toContain("postId");
      expect(columns).toContain("userId");
      expect(columns).toContain("number");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have revision content fields", () => {
      const columns = Object.keys(postRevisions);
      expect(columns).toContain("modifications");
      expect(columns).toContain("hidden");
    });
  });

  describe("TypeScript types", () => {
    it("should define Post type", () => {
      const post: Post = {
        id: 1,
        userId: 1,
        topicId: 1,
        postNumber: 1,
        raw: "# Hello World",
        cooked: "<h1>Hello World</h1>",
        replyToPostNumber: null,
        replyCount: 0,
        quoteCount: 0,
        likeCount: 0,
        reads: 0,
        score: 0,
        hidden: false,
        hiddenAt: null,
        hiddenReasonId: null,
        wiki: false,
        version: 1,
        lastVersionAt: null,
        deletedAt: null,
        deletedById: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(post).toBeDefined();
    });

    it("should define NewPost type", () => {
      const newPost: NewPost = {
        userId: 1,
        topicId: 1,
        postNumber: 1,
        raw: "Hello",
        cooked: "<p>Hello</p>",
      };
      expect(newPost).toBeDefined();
    });

    it("should define PostAction type", () => {
      const postAction: PostAction = {
        id: 1,
        postId: 1,
        userId: 1,
        postActionTypeId: 2,
        deletedAt: null,
        deletedById: null,
        relatedPostId: null,
        staffTookAction: false,
        deferredById: null,
        deferredAt: null,
        agreedAt: null,
        agreedById: null,
        disagreedAt: null,
        disagreedById: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(postAction).toBeDefined();
    });

    it("should define NewPostAction type", () => {
      const newPostAction: NewPostAction = {
        postId: 1,
        userId: 1,
        postActionTypeId: 2,
      };
      expect(newPostAction).toBeDefined();
    });

    it("should define PostRevision type", () => {
      const postRevision: PostRevision = {
        id: 1,
        postId: 1,
        userId: 1,
        number: 2,
        modifications: '{"raw": "Updated text"}',
        hidden: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(postRevision).toBeDefined();
    });

    it("should define NewPostRevision type", () => {
      const newPostRevision: NewPostRevision = {
        postId: 1,
        userId: 1,
        number: 2,
      };
      expect(newPostRevision).toBeDefined();
    });
  });
});
