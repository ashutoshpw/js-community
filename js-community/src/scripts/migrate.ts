/**
 * Database migration script
 *
 * This script applies pending migrations to the database.
 * Run with: bun run migrate or npm run migrate
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set.");
    console.error(
      "Please create a .env file with DATABASE_URL or set it in your environment.",
    );
    console.error(
      "Example: DATABASE_URL=postgres://user:password@localhost:5432/dbname",
    );
    process.exit(1);
  }

  console.log("🔄 Starting database migrations...");
  console.log(
    `Database: ${connectionString.replace(/:[^:@]+@/, ":****@")}`, // Hide password
  );

  // Create a dedicated connection for migrations
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    console.log("📦 Applying pending migrations from ./drizzle...");

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ All migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await migrationClient.end();
    console.log("🔌 Database connection closed.");
  }
}

// Run migrations
runMigrations();
