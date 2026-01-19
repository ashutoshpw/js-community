/**
 * Database seeding script for development
 * Creates seed data for testing UI components
 */

import type { QueryExecutor } from "../src/lib/db/types";

/**
 * Sample user data for seeding
 */
export const seedUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    username: "john_doe",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 3,
    username: "jane_smith",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "moderator",
    createdAt: new Date("2024-02-01"),
  },
];

/**
 * Sample topic/discussion data for seeding
 */
export const seedTopics = [
  {
    id: 1,
    title: "Welcome to the Community!",
    slug: "welcome-to-community",
    userId: 1,
    categoryId: 1,
    views: 150,
    replies: 5,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 2,
    title: "Feature Request: Dark Mode",
    slug: "feature-request-dark-mode",
    userId: 2,
    categoryId: 2,
    views: 89,
    replies: 12,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    title: "Bug Report: Login Issues",
    slug: "bug-report-login-issues",
    userId: 3,
    categoryId: 3,
    views: 45,
    replies: 3,
    createdAt: new Date("2024-02-05"),
  },
];

/**
 * Sample category data for seeding
 */
export const seedCategories = [
  {
    id: 1,
    name: "Announcements",
    slug: "announcements",
    description: "Important announcements and updates",
    color: "#0088cc",
  },
  {
    id: 2,
    name: "Feature Requests",
    slug: "feature-requests",
    description: "Suggest new features",
    color: "#f1c40f",
  },
  {
    id: 3,
    name: "Bug Reports",
    slug: "bug-reports",
    description: "Report bugs and issues",
    color: "#e74c3c",
  },
  {
    id: 4,
    name: "General Discussion",
    slug: "general-discussion",
    description: "General community discussions",
    color: "#9b59b6",
  },
];

/**
 * Sample post/reply data for seeding
 */
export const seedPosts = [
  {
    id: 1,
    topicId: 1,
    userId: 1,
    content: "Welcome to our community! We're excited to have you here.",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 2,
    topicId: 1,
    userId: 2,
    content: "Thanks for having me! Looking forward to participating.",
    createdAt: new Date("2024-01-03"),
  },
  {
    id: 3,
    topicId: 2,
    userId: 2,
    content: "I would love to see a dark mode option. My eyes would thank you!",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 4,
    topicId: 2,
    userId: 3,
    content: "Great idea! Dark mode is essential for late-night browsing.",
    createdAt: new Date("2024-01-21"),
  },
];

/**
 * Seed function that can be called to populate the database
 */
export async function seedDatabase(execute: QueryExecutor): Promise<void> {
  console.log("Starting database seeding...");

  try {
    // Clear existing data (in development only!)
    console.log("Clearing existing data...");
    await execute("DELETE FROM posts");
    await execute("DELETE FROM topics");
    await execute("DELETE FROM categories");
    await execute("DELETE FROM users");

    // Seed categories
    console.log("Seeding categories...");
    for (const category of seedCategories) {
      await execute(
        "INSERT INTO categories (id, name, slug, description, color) VALUES ($1, $2, $3, $4, $5)",
        [
          category.id,
          category.name,
          category.slug,
          category.description,
          category.color,
        ],
      );
    }

    // Seed users
    console.log("Seeding users...");
    for (const user of seedUsers) {
      await execute(
        "INSERT INTO users (id, username, email, name, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.id,
          user.username,
          user.email,
          user.name,
          user.role,
          user.createdAt,
        ],
      );
    }

    // Seed topics
    console.log("Seeding topics...");
    for (const topic of seedTopics) {
      await execute(
        "INSERT INTO topics (id, title, slug, user_id, category_id, views, replies, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          topic.id,
          topic.title,
          topic.slug,
          topic.userId,
          topic.categoryId,
          topic.views,
          topic.replies,
          topic.createdAt,
        ],
      );
    }

    // Seed posts
    console.log("Seeding posts...");
    for (const post of seedPosts) {
      await execute(
        "INSERT INTO posts (id, topic_id, user_id, content, created_at) VALUES ($1, $2, $3, $4, $5)",
        [post.id, post.topicId, post.userId, post.content, post.createdAt],
      );
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

/**
 * Clear all seed data from the database
 */
export async function clearSeedData(execute: QueryExecutor): Promise<void> {
  console.log("Clearing seed data...");

  try {
    await execute("DELETE FROM posts");
    await execute("DELETE FROM topics");
    await execute("DELETE FROM categories");
    await execute("DELETE FROM users");

    console.log("Seed data cleared successfully!");
  } catch (error) {
    console.error("Error clearing seed data:", error);
    throw error;
  }
}

/**
 * Example usage:
 *
 * import { seedDatabase } from './scripts/seed';
 * import { db } from './src/lib/db';
 *
 * seedDatabase(db.execute).then(() => {
 *   console.log('Seeding complete!');
 * });
 */
