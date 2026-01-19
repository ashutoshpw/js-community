/**
 * Test script to verify database connection
 *
 * This script tests the database connection and runs a simple query.
 * Run with: node --env-file=.env scripts/test-db-connection.js
 * Or with tsx: npx tsx scripts/test-db-connection.ts
 */

import { closeConnection, testConnection } from "../src/lib/database";

async function main() {
  console.log("Testing database connection...");
  console.log(
    `Database URL: ${process.env.DATABASE_URL ? "✓ Set" : "✗ Not set"}`,
  );

  if (!process.env.DATABASE_URL) {
    console.error("\n❌ DATABASE_URL environment variable is not set.");
    console.error(
      "Please create a .env file with DATABASE_URL or set it in your environment.",
    );
    console.error(
      "Example: DATABASE_URL=postgres://user:password@localhost:5432/dbname",
    );
    process.exit(1);
  }

  try {
    const isConnected = await testConnection();

    if (isConnected) {
      console.log("\n✅ Database connection successful!");
      console.log("Drizzle ORM is configured and ready to use.");
    } else {
      console.error("\n❌ Database connection failed.");
      console.error(
        "Please check your DATABASE_URL and ensure PostgreSQL is running.",
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Error testing database connection:");
    console.error(error);
    process.exit(1);
  } finally {
    await closeConnection();
    console.log("\nConnection closed.");
  }
}

main();
