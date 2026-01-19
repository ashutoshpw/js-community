import type { Config } from "drizzle-kit";

export default {
  schema: [
    "./src/db/schema/categories.ts",
    "./src/db/schema/groups.ts",
    "./src/db/schema/index.ts",
    "./src/db/schema/permissions.ts",
    "./src/db/schema/posts.ts",
    "./src/db/schema/tags.ts",
    "./src/db/schema/topics.ts",
    "./src/db/schema/users.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
} satisfies Config;
