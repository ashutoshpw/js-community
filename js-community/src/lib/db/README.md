# Database Utilities and Query Helpers

Reusable database utilities and helper functions for the js-community project.

## Features

- **Query Builder Helpers**: Build SQL queries programmatically with type safety
- **Transaction Management**: Handle database transactions with automatic commit/rollback
- **Common Query Patterns**: Pagination, filtering, searching, and ordering
- **Error Handling**: Comprehensive error types and retry logic
- **Seed Data Scripts**: Development data for testing UI components

## Installation

All utilities are available from the main export:

```typescript
import {
  buildSelectQuery,
  withTransaction,
  createPaginatedResult,
  // ... other exports
} from '@/lib/db';
```

## Query Builder Helpers

### Building SELECT Queries

```typescript
import { buildSelectQuery } from '@/lib/db';

// Simple select
const { query, params } = buildSelectQuery('users');
// Result: SELECT * FROM users

// With filters
const { query, params } = buildSelectQuery('users', {
  filters: [
    { field: 'status', operator: 'eq', value: 'active' },
    { field: 'age', operator: 'gte', value: 18 }
  ]
});
// Result: SELECT * FROM users WHERE status = $1 AND age >= $2

// With pagination
const { query, params } = buildSelectQuery('users', {
  pagination: { page: 1, perPage: 20 }
});
// Result: SELECT * FROM users LIMIT $1 OFFSET $2

// With ordering
const { query, params } = buildSelectQuery('users', {
  order: [{ field: 'created_at', direction: 'desc' }]
});
// Result: SELECT * FROM users ORDER BY created_at DESC

// With search
const { query, params } = buildSelectQuery('users', {
  search: {
    query: 'john',
    fields: ['username', 'email', 'name']
  }
});
// Result: SELECT * FROM users WHERE (username LIKE $1 OR email LIKE $1 OR name LIKE $1)
```

### Building INSERT Queries

```typescript
import { buildInsertQuery } from '@/lib/db';

const { query, params } = buildInsertQuery('users', {
  username: 'john_doe',
  email: 'john@example.com',
  name: 'John Doe'
});
// Result: INSERT INTO users (username, email, name) VALUES ($1, $2, $3) RETURNING *
```

### Building UPDATE Queries

```typescript
import { buildUpdateQuery } from '@/lib/db';

const { query, params } = buildUpdateQuery(
  'users',
  { name: 'Jane Doe', email: 'jane@example.com' },
  [{ field: 'id', operator: 'eq', value: 1 }]
);
// Result: UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *
```

### Building DELETE Queries

```typescript
import { buildDeleteQuery } from '@/lib/db';

const { query, params } = buildDeleteQuery('users', [
  { field: 'id', operator: 'eq', value: 1 }
]);
// Result: DELETE FROM users WHERE id = $1
```

## Pagination

### Creating Paginated Results

```typescript
import { createPaginatedResult } from '@/lib/db';

const data = [/* ... query results */];
const total = 100; // total count from database
const pagination = { page: 1, perPage: 20 };

const result = createPaginatedResult(data, total, pagination);
// Returns:
// {
//   data: [...],
//   pagination: {
//     page: 1,
//     perPage: 20,
//     total: 100,
//     totalPages: 5,
//     hasNext: true,
//     hasPrev: false
//   }
// }
```

## Transaction Management

### Basic Transaction

```typescript
import { withTransaction } from '@/lib/db';

const result = await withTransaction(async (tx) => {
  // Perform multiple database operations
  // All will be committed if successful
  // All will be rolled back if any fails
  
  const user = await createUser({ name: 'John' });
  const profile = await createProfile({ userId: user.id });
  
  return { user, profile };
});
```

### Batch Operations

```typescript
import { transactionBatch } from '@/lib/db';

const results = await transactionBatch([
  (tx) => createUser({ name: 'John' }),
  (tx) => createUser({ name: 'Jane' }),
  (tx) => createUser({ name: 'Bob' })
]);
```

### Savepoints

```typescript
import { withSavepoint } from '@/lib/db';

await withTransaction(async (tx) => {
  await createUser({ name: 'John' });
  
  // Try to create profile, rollback to savepoint if it fails
  try {
    await withSavepoint(tx, 'profile_creation', async (sp) => {
      await createProfile({ userId: 1 });
    });
  } catch (error) {
    // Savepoint rolled back, but transaction continues
    console.log('Profile creation failed, continuing...');
  }
  
  await updateUser(1, { verified: true });
});
```

## Error Handling

### Error Types

- `DatabaseError`: Base error class
- `QueryError`: SQL query errors
- `ConnectionError`: Database connection errors
- `TransactionError`: Transaction-related errors
- `ValidationError`: Data validation errors
- `NotFoundError`: Resource not found errors
- `DuplicateError`: Unique constraint violations

### Using Safe Query

```typescript
import { safeQuery } from '@/lib/db';

const result = await safeQuery(async () => {
  return await database.query('SELECT * FROM users WHERE id = $1', [userId]);
});
// Automatically converts database errors to typed errors
```

### Retry Logic

```typescript
import { retryQuery } from '@/lib/db';

const result = await retryQuery(
  async () => database.query('SELECT * FROM users'),
  {
    maxRetries: 3,
    initialDelay: 100,
    maxDelay: 5000,
    backoffMultiplier: 2
  }
);
// Automatically retries with exponential backoff
// Does not retry validation or not-found errors
```

## Database Seeding

### Running Seed Scripts

```typescript
import { seedDatabase } from '../scripts/seed';

// Assuming you have a query executor
await seedDatabase(async (sql, params) => {
  return await db.query(sql, params);
});
```

### Seed Data Included

- **Users**: Admin, regular users, and moderators
- **Categories**: Announcements, feature requests, bug reports, discussions
- **Topics**: Sample discussions in different categories
- **Posts**: Sample replies to topics

### Clearing Seed Data

```typescript
import { clearSeedData } from '../scripts/seed';

await clearSeedData(async (sql, params) => {
  return await db.query(sql, params);
});
```

## Filter Operators

- `eq`: Equal to
- `neq`: Not equal to
- `gt`: Greater than
- `gte`: Greater than or equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `like`: Pattern matching (SQL LIKE)
- `in`: In array
- `nin`: Not in array

## Example: Complete CRUD Operations

```typescript
import {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  withTransaction,
  createPaginatedResult
} from '@/lib/db';

// List users with pagination and filtering
async function listUsers(page = 1, perPage = 20, status = 'active') {
  const { query, params } = buildSelectQuery('users', {
    filters: [{ field: 'status', operator: 'eq', value: status }],
    order: [{ field: 'created_at', direction: 'desc' }],
    pagination: { page, perPage }
  });
  
  const users = await db.query(query, params);
  const { query: countQuery, params: countParams } = buildCountQuery('users', {
    filters: [{ field: 'status', operator: 'eq', value: status }]
  });
  const { count } = await db.query(countQuery, countParams);
  
  return createPaginatedResult(users, count, { page, perPage });
}

// Create a user
async function createUser(data) {
  const { query, params } = buildInsertQuery('users', data);
  return db.query(query, params);
}

// Update a user
async function updateUser(id, data) {
  const { query, params } = buildUpdateQuery('users', data, [
    { field: 'id', operator: 'eq', value: id }
  ]);
  return db.query(query, params);
}

// Delete a user
async function deleteUser(id) {
  const { query, params } = buildDeleteQuery('users', [
    { field: 'id', operator: 'eq', value: id }
  ]);
  return db.query(query, params);
}
```

## Best Practices

1. **Always use parameterized queries**: The query builders automatically create parameterized queries to prevent SQL injection
2. **Use transactions for multi-step operations**: Ensure data consistency with transaction wrappers
3. **Handle errors appropriately**: Use the typed error classes to handle different error scenarios
4. **Use pagination for large result sets**: Avoid loading too much data at once
5. **Test with seed data**: Use the seeding scripts to populate test data for UI development

## TypeScript Support

All utilities are fully typed with TypeScript. Import types from the main export:

```typescript
import type {
  PaginationOptions,
  PaginationResult,
  FilterOptions,
  QueryOptions,
  TransactionContext
} from '@/lib/db';
```
