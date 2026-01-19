/**
 * Example usage of database utilities
 * This file demonstrates how to use the database utilities in practice
 */

import {
  buildCountQuery,
  buildDeleteQuery,
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
  createPaginatedResult,
  type PaginationOptions,
  type QueryExecutor,
  withTransaction,
} from "@/lib/db";

/**
 * Example: Define a query executor function
 * This would typically be implemented by your database client (e.g., pg, mysql2, etc.)
 */
const mockExecute: QueryExecutor = async (sql: string, params?: unknown[]) => {
  console.log("Executing query:", sql);
  console.log("With parameters:", params);
  // In real implementation, this would execute against a real database
  return Promise.resolve([]);
};

/**
 * Example 1: List users with pagination and filtering
 */
export async function listUsers(
  execute: QueryExecutor,
  page = 1,
  perPage = 20,
  status = "active",
) {
  // Build the select query
  const { query, params } = buildSelectQuery("users", {
    filters: [{ field: "status", operator: "eq", value: status }],
    order: [{ field: "created_at", direction: "desc" }],
    pagination: { page, perPage },
  });

  // Execute the query to get users
  const users = (await execute(query, params)) as unknown[];

  // Get total count
  const { query: countQuery, params: countParams } = buildCountQuery("users", {
    filters: [{ field: "status", operator: "eq", value: status }],
  });
  const countResult = await execute(countQuery, countParams);
  const total = (countResult as { count: number }[])[0].count;

  // Return paginated result
  return createPaginatedResult(users, total, { page, perPage });
}

/**
 * Example 2: Create a new user
 */
export async function createUser(
  execute: QueryExecutor,
  userData: {
    username: string;
    email: string;
    name: string;
    role?: string;
  },
) {
  const { query, params } = buildInsertQuery("users", {
    ...userData,
    role: userData.role || "user",
    created_at: new Date(),
  });

  return execute(query, params);
}

/**
 * Example 3: Update a user
 */
export async function updateUser(
  execute: QueryExecutor,
  userId: number,
  updates: {
    name?: string;
    email?: string;
    role?: string;
  },
) {
  const { query, params } = buildUpdateQuery("users", updates, [
    { field: "id", operator: "eq", value: userId },
  ]);

  return execute(query, params);
}

/**
 * Example 4: Delete a user
 */
export async function deleteUser(execute: QueryExecutor, userId: number) {
  const { query, params } = buildDeleteQuery("users", [
    { field: "id", operator: "eq", value: userId },
  ]);

  return execute(query, params);
}

/**
 * Example 5: Search users
 */
export async function searchUsers(
  execute: QueryExecutor,
  searchQuery: string,
  pagination: PaginationOptions,
) {
  const { query, params } = buildSelectQuery("users", {
    search: {
      query: searchQuery,
      fields: ["username", "email", "name"],
    },
    order: [{ field: "username", direction: "asc" }],
    pagination,
  });

  const users = (await execute(query, params)) as unknown[];

  const { query: countQuery, params: countParams } = buildCountQuery("users", {
    search: {
      query: searchQuery,
      fields: ["username", "email", "name"],
    },
  });
  const countResult = await execute(countQuery, countParams);
  const total = (countResult as { count: number }[])[0].count;

  return createPaginatedResult(users, total, pagination);
}

/**
 * Example 6: Complex query with multiple filters
 */
export async function getActiveAdmins(execute: QueryExecutor) {
  const { query, params } = buildSelectQuery("users", {
    filters: [
      { field: "status", operator: "eq", value: "active" },
      { field: "role", operator: "eq", value: "admin" },
      { field: "created_at", operator: "gte", value: new Date("2024-01-01") },
    ],
    order: [{ field: "created_at", direction: "desc" }],
  });

  return execute(query, params);
}

/**
 * Example 7: Transaction - Create user with profile
 */
export async function createUserWithProfile(
  execute: QueryExecutor,
  userData: {
    username: string;
    email: string;
    name: string;
  },
  profileData: {
    bio: string;
    avatar?: string;
  },
) {
  return withTransaction(async (tx) => {
    console.log("Transaction started:", tx.id);

    // Create user
    const { query: userQuery, params: userParams } = buildInsertQuery("users", {
      ...userData,
      created_at: new Date(),
    });
    const userResult = await execute(userQuery, userParams);
    const user = (userResult as { id: number }[])[0];

    // Create profile
    const { query: profileQuery, params: profileParams } = buildInsertQuery(
      "profiles",
      {
        user_id: user.id,
        ...profileData,
      },
    );
    const profile = await execute(profileQuery, profileParams);

    return { user, profile };
  });
}

/**
 * Example 8: Get topics with category and user info
 */
export async function getTopicsWithDetails(
  execute: QueryExecutor,
  categoryId?: number,
  pagination?: PaginationOptions,
) {
  const filters = categoryId
    ? [{ field: "category_id", operator: "eq" as const, value: categoryId }]
    : [];

  const { query, params } = buildSelectQuery("topics", {
    filters,
    order: [
      { field: "created_at", direction: "desc" },
      { field: "views", direction: "desc" },
    ],
    pagination: pagination || { page: 1, perPage: 20 },
  });

  const topics = (await execute(query, params)) as unknown[];

  if (pagination) {
    const { query: countQuery, params: countParams } = buildCountQuery(
      "topics",
      { filters },
    );
    const countResult = await execute(countQuery, countParams);
    const total = (countResult as { count: number }[])[0].count;

    return createPaginatedResult(topics, total, pagination);
  }

  return topics;
}

/**
 * Example usage demonstration
 */
async function _demonstrateUsage() {
  console.log("=== Database Utilities Examples ===\n");

  // Example 1: List users
  console.log("1. List active users (page 1, 20 per page):");
  await listUsers(mockExecute, 1, 20, "active");

  // Example 2: Create user
  console.log("\n2. Create new user:");
  await createUser(mockExecute, {
    username: "john_doe",
    email: "john@example.com",
    name: "John Doe",
  });

  // Example 3: Update user
  console.log("\n3. Update user:");
  await updateUser(mockExecute, 1, {
    name: "Jane Doe",
    email: "jane@example.com",
  });

  // Example 4: Search users
  console.log("\n4. Search users:");
  await searchUsers(mockExecute, "john", { page: 1, perPage: 10 });

  // Example 5: Get active admins
  console.log("\n5. Get active admins:");
  await getActiveAdmins(mockExecute);

  // Example 6: Transaction example
  console.log("\n6. Create user with profile (transaction):");
  await createUserWithProfile(
    mockExecute,
    {
      username: "alice",
      email: "alice@example.com",
      name: "Alice Smith",
    },
    {
      bio: "Software developer",
      avatar: "https://example.com/avatar.jpg",
    },
  );
}

// Uncomment to run examples
// demonstrateUsage();
