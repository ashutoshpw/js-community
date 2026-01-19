/**
 * Tests for the database migration script
 */

import { describe, expect, it } from "vitest";

describe("Migration System", () => {
  it("should have migration script at expected location", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const migratePath = path.join(__dirname, "..", "scripts", "migrate.ts");

    await expect(fs.access(migratePath)).resolves.not.toThrow();
  });

  it("should have drizzle config file", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const configPath = path.join(__dirname, "..", "..", "drizzle.config.ts");

    await expect(fs.access(configPath)).resolves.not.toThrow();
  });

  it("should have migration directory structure", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const drizzlePath = path.join(__dirname, "..", "..", "drizzle");

    // Check that drizzle directory exists
    await expect(fs.access(drizzlePath)).resolves.not.toThrow();

    const stats = await fs.stat(drizzlePath);
    expect(stats.isDirectory()).toBe(true);
  });

  it("should have initial migration file", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const drizzlePath = path.join(__dirname, "..", "..", "drizzle");
    const files = await fs.readdir(drizzlePath);

    // Check for at least one .sql file
    const sqlFiles = files.filter((f) => f.endsWith(".sql"));
    expect(sqlFiles.length).toBeGreaterThan(0);
  });

  it("should have migration metadata", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const metaPath = path.join(__dirname, "..", "..", "drizzle", "meta");

    await expect(fs.access(metaPath)).resolves.not.toThrow();

    // Check for _journal.json
    const journalPath = path.join(metaPath, "_journal.json");
    await expect(fs.access(journalPath)).resolves.not.toThrow();
  });

  it("should have correct package.json scripts", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const packagePath = path.join(__dirname, "..", "..", "package.json");
    const packageJson = JSON.parse(await fs.readFile(packagePath, "utf-8"));

    expect(packageJson.scripts).toHaveProperty("db:generate");
    expect(packageJson.scripts).toHaveProperty("db:migrate");
    expect(packageJson.scripts).toHaveProperty("db:push");
    expect(packageJson.scripts).toHaveProperty("db:studio");
    expect(packageJson.scripts).toHaveProperty("db:check");

    // Verify correct migration script
    expect(packageJson.scripts["db:migrate"]).toContain("tsx");
    expect(packageJson.scripts["db:migrate"]).toContain("migrate.ts");
  });

  it("should have tsx as dev dependency", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const packagePath = path.join(__dirname, "..", "..", "package.json");
    const packageJson = JSON.parse(await fs.readFile(packagePath, "utf-8"));

    expect(packageJson.devDependencies).toHaveProperty("tsx");
  });

  it("should have drizzle-kit as dev dependency", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const packagePath = path.join(__dirname, "..", "..", "package.json");
    const packageJson = JSON.parse(await fs.readFile(packagePath, "utf-8"));

    expect(packageJson.devDependencies).toHaveProperty("drizzle-kit");
  });

  it("drizzle config should exclude test files", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const configPath = path.join(__dirname, "..", "..", "drizzle.config.ts");
    const configContent = await fs.readFile(configPath, "utf-8");

    // Should not include wildcard pattern that would catch test files
    expect(configContent).not.toContain('schema: "./src/db/schema/*"');

    // Should have explicit file list or proper filtering
    const hasExplicitFiles = configContent.includes("schema: [");
    expect(hasExplicitFiles).toBe(true);
  });

  it("migration script should handle missing DATABASE_URL", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const migratePath = path.join(__dirname, "migrate.ts");
    const migrateContent = await fs.readFile(migratePath, "utf-8");

    // Should check for DATABASE_URL
    expect(migrateContent).toContain("DATABASE_URL");
    expect(migrateContent).toContain("environment variable");
  });

  it("migration script should provide user-friendly output", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const migratePath = path.join(__dirname, "migrate.ts");
    const migrateContent = await fs.readFile(migratePath, "utf-8");

    // Should have emojis and clear messages
    expect(migrateContent).toContain("Starting database migrations");
    expect(migrateContent).toContain("migrations applied successfully");
  });
});
