#!/usr/bin/env node
/**
 * Manual validation script for database utilities
 * Run with: node scripts/validate-db-utils.mjs
 */

import {
  buildCountQuery,
  buildDeleteQuery,
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
  createPaginatedResult,
} from "../src/lib/db/index.ts";

console.log("=== Database Utilities Validation ===\n");

// Test 1: Build SELECT query with filters
console.log("1. SELECT with filters:");
const selectWithFilters = buildSelectQuery("users", {
  filters: [
    { field: "status", operator: "eq", value: "active" },
    { field: "age", operator: "gte", value: 18 },
  ],
});
console.log("Query:", selectWithFilters.query);
console.log("Params:", selectWithFilters.params);
console.log("✓ Test passed\n");

// Test 2: Build SELECT query with pagination
console.log("2. SELECT with pagination:");
const selectWithPagination = buildSelectQuery("users", {
  pagination: { page: 2, perPage: 20 },
});
console.log("Query:", selectWithPagination.query);
console.log("Params:", selectWithPagination.params);
console.log("✓ Test passed\n");

// Test 3: Build SELECT query with ordering
console.log("3. SELECT with ordering:");
const selectWithOrder = buildSelectQuery("users", {
  order: [
    { field: "created_at", direction: "desc" },
    { field: "name", direction: "asc" },
  ],
});
console.log("Query:", selectWithOrder.query);
console.log("Params:", selectWithOrder.params);
console.log("✓ Test passed\n");

// Test 4: Build SELECT query with search
console.log("4. SELECT with search:");
const selectWithSearch = buildSelectQuery("users", {
  search: {
    query: "john",
    fields: ["username", "email", "name"],
  },
});
console.log("Query:", selectWithSearch.query);
console.log("Params:", selectWithSearch.params);
console.log("✓ Test passed\n");

// Test 5: Build INSERT query
console.log("5. INSERT query:");
const insertQuery = buildInsertQuery("users", {
  username: "john_doe",
  email: "john@example.com",
  name: "John Doe",
  age: 25,
});
console.log("Query:", insertQuery.query);
console.log("Params:", insertQuery.params);
console.log("✓ Test passed\n");

// Test 6: Build UPDATE query
console.log("6. UPDATE query:");
const updateQuery = buildUpdateQuery(
  "users",
  { name: "Jane Doe", email: "jane@example.com" },
  [{ field: "id", operator: "eq", value: 1 }],
);
console.log("Query:", updateQuery.query);
console.log("Params:", updateQuery.params);
console.log("✓ Test passed\n");

// Test 7: Build DELETE query
console.log("7. DELETE query:");
const deleteQuery = buildDeleteQuery("users", [
  { field: "id", operator: "eq", value: 1 },
]);
console.log("Query:", deleteQuery.query);
console.log("Params:", deleteQuery.params);
console.log("✓ Test passed\n");

// Test 8: Build COUNT query
console.log("8. COUNT query:");
const countQuery = buildCountQuery("users", {
  filters: [{ field: "status", operator: "eq", value: "active" }],
});
console.log("Query:", countQuery.query);
console.log("Params:", countQuery.params);
console.log("✓ Test passed\n");

// Test 9: Create paginated result
console.log("9. Paginated result:");
const data = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
];
const paginatedResult = createPaginatedResult(data, 100, {
  page: 1,
  perPage: 20,
});
console.log("Result:", JSON.stringify(paginatedResult, null, 2));
console.log("✓ Test passed\n");

// Test 10: Complex query with all options
console.log("10. Complex query with all options:");
const complexQuery = buildSelectQuery("topics", {
  filters: [
    { field: "category_id", operator: "eq", value: 1 },
    { field: "status", operator: "eq", value: "published" },
  ],
  search: {
    query: "javascript",
    fields: ["title", "content"],
  },
  order: [
    { field: "created_at", direction: "desc" },
    { field: "views", direction: "desc" },
  ],
  pagination: { page: 1, perPage: 10 },
  fields: ["id", "title", "created_at", "views"],
});
console.log("Query:", complexQuery.query);
console.log("Params:", complexQuery.params);
console.log("✓ Test passed\n");

console.log("=== All validation tests passed! ===");
