/**
 * Database connection and Drizzle ORM setup
 * Main database instance for the application
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database connection configuration
const connectionString = process.env.DATABASE_URL;

// During build time, DATABASE_URL may not be set
// We create a dummy connection that will fail at runtime if used without proper config
const isBuildTime = process.env.NODE_ENV === "production" && !connectionString;

if (!connectionString && !isBuildTime) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure your database connection.",
  );
}

// Create postgres connection client
// For production, you may want to configure connection pool settings
const client = isBuildTime
  ? ({} as ReturnType<typeof postgres>)
  : postgres(connectionString as string, {
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
    });

// Create Drizzle ORM instance
export const db = drizzle(client);

// Export the raw client for advanced use cases
export { client };

/**
 * Test database connection
 * @returns Promise that resolves if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  if (isBuildTime) {
    return false;
  }
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

/**
 * Close database connection
 * Should be called when shutting down the application
 */
export async function closeConnection(): Promise<void> {
  if (isBuildTime) {
    return;
  }
  await client.end();
}
