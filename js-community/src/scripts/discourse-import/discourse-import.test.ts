/**
 * Tests for the Discourse import pipeline
 *
 * Covers:
 * - Mapper correctness (user, category, topic, post, tag)
 * - Idempotent re-runs (resume behavior via ImportState)
 * - parseConfig flag parsing
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { parseConfig } from "./config";
import type { DiscourseCategory } from "./mappers/category.mapper";
import { mapCategory } from "./mappers/category.mapper";
import type { DiscoursePost } from "./mappers/post.mapper";
import { mapPost } from "./mappers/post.mapper";
import type { DiscourseTag } from "./mappers/tag.mapper";
import { mapTag, mapTopicTag } from "./mappers/tag.mapper";
import type { DiscourseTopic } from "./mappers/topic.mapper";
import { mapTopic } from "./mappers/topic.mapper";
import type { DiscourseUser } from "./mappers/user.mapper";
import { mapUser } from "./mappers/user.mapper";
import { ImportState } from "./state";

// ---------------------------------------------------------------------------
// parseConfig
// ---------------------------------------------------------------------------

describe("parseConfig", () => {
  it("throws when --input-dir is missing", () => {
    expect(() => parseConfig([])).toThrow("--input-dir");
  });

  it("parses minimal flags", () => {
    const cfg = parseConfig(["--input-dir=/tmp/exports"]);
    expect(cfg.inputDir).toBe("/tmp/exports");
    expect(cfg.stage).toBe("all");
    expect(cfg.dryRun).toBe(false);
    expect(cfg.resume).toBe(false);
    expect(cfg.batchSize).toBe(500);
  });

  it("parses all flags", () => {
    const cfg = parseConfig([
      "--input-dir=/data",
      "--stage=users",
      "--dry-run",
      "--resume",
      "--batch-size=100",
      "--state-dir=/tmp/state",
    ]);
    expect(cfg.stage).toBe("users");
    expect(cfg.dryRun).toBe(true);
    expect(cfg.resume).toBe(true);
    expect(cfg.batchSize).toBe(100);
    expect(cfg.stateDir).toBe("/tmp/state");
  });

  it("throws for unknown stage", () => {
    expect(() => parseConfig(["--input-dir=/data", "--stage=invalid"])).toThrow(
      "--stage must be one of",
    );
  });
});

// ---------------------------------------------------------------------------
// mapUser
// ---------------------------------------------------------------------------

describe("mapUser", () => {
  const raw: DiscourseUser = {
    id: 1,
    username: "alice",
    email: "alice@example.com",
    admin: false,
    trust_level: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    bio_raw: "Hello world",
    location: "NYC",
  };

  it("maps basic fields", () => {
    const { user } = mapUser(raw);
    expect(user.username).toBe("alice");
    expect(user.email).toBe("alice@example.com");
    expect(user.trustLevel).toBe(2);
    expect(user.admin).toBe(false);
  });

  it("maps profile fields", () => {
    const { profile } = mapUser(raw);
    expect(profile.location).toBe("NYC");
    expect(profile.bioRaw).toBe("Hello world");
    expect(profile.avatarUrl).toBeNull();
  });

  it("defaults missing optional fields", () => {
    const { user } = mapUser({ id: 2, username: "bob", email: "bob@b.com" });
    expect(user.moderator).toBe(false);
    expect(user.active).toBe(true);
    expect(user.suspended).toBe(false);
    expect(user.lastSeenAt).toBeNull();
  });

  it("parses timestamps", () => {
    const { user } = mapUser(raw);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt?.getFullYear()).toBe(2024);
  });
});

// ---------------------------------------------------------------------------
// mapCategory
// ---------------------------------------------------------------------------

describe("mapCategory", () => {
  const raw: DiscourseCategory = {
    id: 10,
    name: "Announcements",
    slug: "announcements",
    color: "FF0000",
    position: 1,
  };

  it("maps name and slug", () => {
    const cat = mapCategory(raw);
    expect(cat.name).toBe("Announcements");
    expect(cat.slug).toBe("announcements");
    expect(cat.color).toBe("FF0000");
  });

  it("auto-generates slug from name when absent", () => {
    const cat = mapCategory({ id: 1, name: "Hello World" });
    expect(cat.slug).toBe("hello-world");
  });

  it("sets parentCategoryId when provided", () => {
    const cat = mapCategory(raw, 99);
    expect(cat.parentCategoryId).toBe(99);
  });

  it("defaults parentCategoryId to null", () => {
    const cat = mapCategory(raw);
    expect(cat.parentCategoryId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// mapTopic
// ---------------------------------------------------------------------------

describe("mapTopic", () => {
  const raw: DiscourseTopic = {
    id: 5,
    title: "Welcome to the forum",
    slug: "welcome-to-the-forum",
    user_id: 1,
    created_at: "2024-03-01T00:00:00Z",
  };

  it("maps title, slug, userId, categoryId", () => {
    const t = mapTopic(raw, 42, 7, "5");
    expect(t.title).toBe("Welcome to the forum");
    expect(t.slug).toBe("welcome-to-the-forum-5");
    expect(t.userId).toBe(42);
    expect(t.categoryId).toBe(7);
  });

  it("appends slugSuffix to ensure uniqueness", () => {
    const t = mapTopic(raw, 1, null, "discourse-5");
    expect(t.slug).toContain("discourse-5");
  });

  it("defaults counts to zero", () => {
    const t = mapTopic(raw, 1, null, "1");
    expect(t.views).toBe(0);
    expect(t.postsCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// mapPost
// ---------------------------------------------------------------------------

describe("mapPost", () => {
  const raw: DiscoursePost = {
    id: 100,
    user_id: 1,
    topic_id: 5,
    post_number: 1,
    raw: "# Hello",
    cooked: "<h1>Hello</h1>",
    created_at: "2024-03-01T00:00:00Z",
  };

  it("maps core fields", () => {
    const p = mapPost(raw, 42, 7);
    expect(p.userId).toBe(42);
    expect(p.topicId).toBe(7);
    expect(p.postNumber).toBe(1);
    expect(p.raw).toBe("# Hello");
    expect(p.cooked).toBe("<h1>Hello</h1>");
  });

  it("falls back cooked to raw when absent", () => {
    const p = mapPost({ ...raw, cooked: undefined }, 1, 1);
    expect(p.cooked).toBe("# Hello");
  });

  it("defaults numeric fields to 0", () => {
    const p = mapPost(raw, 1, 1);
    expect(p.likeCount).toBe(0);
    expect(p.reads).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// mapTag / mapTopicTag
// ---------------------------------------------------------------------------

describe("mapTag", () => {
  const raw: DiscourseTag = {
    id: 3,
    name: "javascript",
    topic_count: 10,
  };

  it("maps name and topic count", () => {
    const t = mapTag(raw);
    expect(t.name).toBe("javascript");
    expect(t.topicCount).toBe(10);
    expect(t.targetTagId).toBeNull();
  });
});

describe("mapTopicTag", () => {
  it("maps topic and tag ids", () => {
    const tt = mapTopicTag(1, 2);
    expect(tt.topicId).toBe(1);
    expect(tt.tagId).toBe(2);
    expect(tt.createdAt).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// ImportState — checkpoint + ID map
// ---------------------------------------------------------------------------

describe("ImportState", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "import-state-test-"));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("initialises fresh checkpoint", () => {
    const s = new ImportState(tmpDir);
    expect(s.isStageComplete("users")).toBe(false);
    expect(s.getOffset("users")).toBe(0);
  });

  it("saves and reads back offsets", () => {
    const s = new ImportState(tmpDir);
    s.saveOffset("users", 250);
    // Re-instantiate to verify persistence
    const s2 = new ImportState(tmpDir);
    expect(s2.getOffset("users")).toBe(250);
  });

  it("marks stages complete and persists", () => {
    const s = new ImportState(tmpDir);
    s.markStageComplete("users", {
      processed: 10,
      succeeded: 10,
      failed: 0,
      skipped: 0,
    });
    const s2 = new ImportState(tmpDir);
    expect(s2.isStageComplete("users")).toBe(true);
    expect(s2.getProgress("users")?.succeeded).toBe(10);
  });

  it("saves and retrieves ID mappings", () => {
    const s = new ImportState(tmpDir);
    s.setMapping("users", 101, 1);
    s.setMapping("users", 202, 2);
    expect(s.getMapping("users", 101)).toBe(1);
    expect(s.getMapping("users", 202)).toBe(2);
    expect(s.getMapping("users", 999)).toBeUndefined();
  });

  it("persists ID mappings across instances (resume simulation)", () => {
    const s1 = new ImportState(tmpDir);
    s1.setMapping("topics", 50, 500);
    const s2 = new ImportState(tmpDir);
    expect(s2.getMapping("topics", 50)).toBe(500);
  });

  it("re-run idempotency: already-complete stage is detected", () => {
    const s = new ImportState(tmpDir);
    s.markStageComplete("categories", {
      processed: 5,
      succeeded: 5,
      failed: 0,
      skipped: 0,
    });
    // Simulate run loop that skips completed stages
    expect(s.isStageComplete("categories")).toBe(true);
    expect(s.isStageComplete("topics")).toBe(false);
  });
});
