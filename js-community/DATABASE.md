# Database Setup with Drizzle ORM

This document explains how to set up and use the database connection with Drizzle ORM and PostgreSQL.

## Prerequisites

- PostgreSQL 12 or higher installed and running
- Node.js 18 or higher
- A PostgreSQL database created for the application

## Installation

All required dependencies have been installed:

- `drizzle-orm` - The ORM library
- `postgres` - PostgreSQL client for Node.js
- `drizzle-kit` - CLI tool for migrations and schema management

## Configuration

### 1. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your database connection URL:

```env
DATABASE_URL=postgres://username:password@localhost:5432/database_name
```

**Connection String Format:**
```
postgres://[user]:[password]@[host]:[port]/[database]?[options]
```

**Examples:**

Local development:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/js_community_dev
```

Production with SSL:
```
DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
```

### 2. Test the connection

Run the test script to verify your database connection:

```bash
npx tsx scripts/test-db-connection.ts
```

Or with node (if you have Node.js 20.6+):
```bash
node --env-file=.env scripts/test-db-connection.ts
```

You should see:
```
✅ Database connection successful!
Drizzle ORM is configured and ready to use.
```

## Usage

### Import the database instance

```typescript
import { db } from '@/lib/database';
```

### Run queries

```typescript
// Example: Select all users
const users = await db.select().from(usersTable);

// Example: Insert a user
const newUser = await db.insert(usersTable).values({
  username: 'john_doe',
  email: 'john@example.com',
}).returning();
```

### Use raw SQL (when needed)

```typescript
import { client } from '@/lib/database';

// Run raw SQL query
const result = await client`SELECT * FROM users WHERE id = ${userId}`;
```

## Schema Management

### Define schemas

Add your table definitions to `src/lib/db/schema.ts`:

```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Generate migrations

When you modify the schema, generate a migration:

```bash
npm run db:generate
```

This creates SQL migration files in the `drizzle/` directory.

### Apply migrations

Push changes directly to the database (for development):

```bash
npm run db:push
```

Or run migrations (for production):

```bash
npm run db:migrate
```

### Database Studio

Launch Drizzle Studio to browse your database:

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate migration files from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Push schema changes directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio web interface |

## Connection Configuration

The database connection is configured in `src/lib/database.ts` with the following defaults:

- **Max connections:** 10
- **Idle timeout:** 20 seconds
- **Connect timeout:** 10 seconds

You can adjust these settings in `src/lib/database.ts` based on your needs.

## Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use migrations for schema changes** - Don't modify the database directly
3. **Test locally first** - Always test migrations on a development database
4. **Use transactions** - For operations that modify multiple tables
5. **Close connections** - The connection is automatically managed, but you can call `closeConnection()` when needed

## Troubleshooting

### "DATABASE_URL environment variable is not set"

Make sure you have a `.env` file in the `js-community/` directory with a valid `DATABASE_URL`.

### "Connection refused" or "ECONNREFUSED"

- Check that PostgreSQL is running: `pg_isready` or `brew services list` (macOS)
- Verify the host, port, username, and password in your connection string
- Ensure the database exists: `createdb js_community_dev`

### "password authentication failed"

- Double-check your username and password
- Ensure the user has access to the database
- Check PostgreSQL's `pg_hba.conf` for authentication settings

### Migration errors

- Ensure all migrations in `drizzle/` are applied
- Check that the schema matches your database state
- Try generating a new migration: `npm run db:generate`

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
