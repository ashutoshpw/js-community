/**
 * Example: Using Drizzle ORM with PostgreSQL
 * 
 * This file demonstrates how to use the database connection in your application.
 * 
 * IMPORTANT: Before running these examples, ensure:
 * 1. PostgreSQL is running
 * 2. DATABASE_URL is set in your .env file
 * 3. You have created a test table (see schema.ts)
 */

import { db } from "@/lib/database";

/**
 * Example 1: Simple query using raw SQL
 */
export async function simpleQuery() {
  // You can use the db instance to run Drizzle queries
  // For now, since we don't have tables defined, here's a basic example:
  
  // Once you define a schema (e.g., a users table), you can do:
  // const users = await db.select().from(usersTable);
  // return users;
  
  console.log("Database instance is ready to use");
  return { status: "ready" };
}

/**
 * Example 2: Using transactions
 * 
 * Transactions ensure that multiple operations either all succeed or all fail
 */
export async function exampleTransaction() {
  // await db.transaction(async (tx) => {
  //   // All operations in this block are part of the same transaction
  //   const user = await tx.insert(usersTable).values({
  //     username: 'john_doe',
  //     email: 'john@example.com',
  //   }).returning();
  //   
  //   const profile = await tx.insert(profilesTable).values({
  //     userId: user[0].id,
  //     bio: 'Hello world',
  //   }).returning();
  //   
  //   return { user, profile };
  // });
}

/**
 * Example 3: Query with filters
 */
export async function queryWithFilters() {
  // Once you have a schema defined:
  // const activeUsers = await db
  //   .select()
  //   .from(usersTable)
  //   .where(eq(usersTable.status, 'active'));
  // 
  // return activeUsers;
}

/**
 * Example 4: Joining tables
 */
export async function queryWithJoins() {
  // const usersWithProfiles = await db
  //   .select({
  //     user: usersTable,
  //     profile: profilesTable,
  //   })
  //   .from(usersTable)
  //   .leftJoin(profilesTable, eq(usersTable.id, profilesTable.userId));
  // 
  // return usersWithProfiles;
}

/**
 * Next steps:
 * 
 * 1. Define your schema in src/lib/db/schema.ts
 * 2. Generate migrations: npm run db:generate
 * 3. Apply migrations: npm run db:push (dev) or npm run db:migrate (prod)
 * 4. Import your tables and use them with the db instance
 * 
 * Example schema:
 * 
 * import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
 * 
 * export const users = pgTable('users', {
 *   id: serial('id').primaryKey(),
 *   username: varchar('username', { length: 255 }).notNull().unique(),
 *   email: varchar('email', { length: 255 }).notNull().unique(),
 *   createdAt: timestamp('created_at').defaultNow().notNull(),
 * });
 */
