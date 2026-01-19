/**
 * Database schema definitions using Drizzle ORM
 *
 * This file re-exports all schema definitions from the schema directory.
 * Schema definitions are organized by domain:
 * - users: User accounts, emails, and profiles
 * - topics: Discussion topics and topic-user relationships
 * - posts: Posts, post actions, and post revisions
 */

// Re-export all schemas from the schema directory
export * from "@/db/schema";
