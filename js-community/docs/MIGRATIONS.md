# Database Migrations Guide

This guide explains how to manage database schema changes using Drizzle ORM's migration system.

## Overview

The project uses **Drizzle Kit** for generating SQL migrations and a custom migration script for applying them. This approach:

- Provides version control for database schema changes
- Ensures schema consistency across environments
- Enables safe rollback capabilities
- Supports team collaboration on schema changes
- Maintains compatibility with multisite architecture (future)

## Prerequisites

- PostgreSQL 12 or higher running locally or remotely
- Node.js 18 or higher
- Environment variable `DATABASE_URL` configured in `.env`

## Migration Workflow

### 1. Modify Schema

Edit your schema files in `src/db/schema/`:

```typescript
// Example: Add a new column to users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  // Add new column
  displayName: varchar("display_name", { length: 255 }),
  // ... other columns
});
```

### 2. Generate Migration

Generate a new migration file from your schema changes:

```bash
npm run db:generate
```

This command:
- Compares your schema definitions with the current migration state
- Generates SQL migration files in the `drizzle/` directory
- Creates metadata for tracking migrations

**Output example:**
```
27 tables
users 18 columns 4 indexes 0 fks
[✓] Your SQL migration file ➜ drizzle/0001_new_migration.sql 🚀
```

### 3. Review Migration

**IMPORTANT:** Always review generated migrations before applying them:

```bash
cat drizzle/0001_*.sql
```

Check for:
- Correctness of SQL statements
- Potential data loss (dropped columns/tables)
- Missing indexes or constraints
- Performance implications

### 4. Apply Migration

Apply pending migrations to your database:

```bash
npm run db:migrate
```

This runs the custom migration script (`src/scripts/migrate.ts`) which:
- Connects to your database
- Applies all pending migrations in order
- Updates the migration tracking table
- Reports success or failure

**Output example:**
```
🔄 Starting database migrations...
Database: postgres://user:****@localhost:5432/js_community
📦 Applying pending migrations from ./drizzle...
✅ All migrations applied successfully!
```

## Available Scripts

| Script | Description | When to Use |
|--------|-------------|-------------|
| `npm run db:generate` | Generate migration files from schema | After modifying schema files |
| `npm run db:migrate` | Apply pending migrations | Deploy changes to database |
| `npm run db:push` | Push schema directly (no migration) | **Development only** - quick prototyping |
| `npm run db:studio` | Open Drizzle Studio GUI | Browse/edit database visually |
| `npm run db:check` | Validate migration consistency | Before committing changes |

## Best Practices

### DO ✅

1. **Generate migrations for all schema changes**
   ```bash
   npm run db:generate
   git add drizzle/
   git commit -m "feat: add display_name to users"
   ```

2. **Review migrations before applying**
   - Check the SQL for correctness
   - Test on a development database first
   - Verify data preservation

3. **Test migrations in isolation**
   - Create a test database
   - Apply migration
   - Verify application works
   - Check for performance issues

4. **Commit migrations with schema changes**
   - Include both `src/db/schema/*` and `drizzle/*` in commits
   - Keep migrations atomic and focused

5. **Use descriptive schema changes**
   ```typescript
   // Good - clear intent
   suspendedAt: timestamp("suspended_at"),
   
   // Avoid - unclear
   data: text("data"),
   ```

### DON'T ❌

1. **Don't use `db:push` in production**
   - It bypasses migration tracking
   - Can cause data loss
   - Doesn't create migration files

2. **Don't modify existing migrations**
   - Once applied, migrations are immutable
   - Create a new migration to fix issues
   - Exception: migrations not yet in production

3. **Don't delete migration files**
   - Breaks migration history
   - Causes sync issues for team
   - May prevent rollbacks

4. **Don't skip migration review**
   - Auto-generated SQL may not be optimal
   - Could cause unexpected behavior
   - May have performance implications

## Development vs Production

### Development

Fast iteration with `db:push`:
```bash
# Quick prototyping - NOT for production
npm run db:push
```

**Use when:**
- Rapid experimentation
- Schema not finalized
- Local development only

### Production

Always use migrations:
```bash
# Generate migration
npm run db:generate

# Review the generated SQL
cat drizzle/XXXX_*.sql

# Apply to staging
DATABASE_URL=postgres://staging npm run db:migrate

# Apply to production
DATABASE_URL=postgres://production npm run db:migrate
```

## Troubleshooting

### "No migrations to apply"

Your schema matches the database state. This means:
- All migrations already applied, OR
- You haven't generated a migration yet

```bash
# Generate migration if you made schema changes
npm run db:generate
```

### "Migration failed" errors

1. **Check database connection:**
   ```bash
   npx tsx scripts/test-db-connection.ts
   ```

2. **Verify migration SQL:**
   - Check for syntax errors
   - Ensure required tables exist
   - Check for constraint violations

3. **Check database state:**
   ```bash
   npm run db:studio
   # Verify tables/columns exist as expected
   ```

### Schema drift (database doesn't match migrations)

```bash
# Validate schema consistency
npm run db:check

# If drift detected, options:
# 1. Generate fixing migration
npm run db:generate

# 2. (DEV ONLY) Reset to migrations
# WARNING: This drops all data!
# dropdb js_community_dev && createdb js_community_dev
# npm run db:migrate
```

## CI/CD Integration

The project includes automated migration checks in GitHub Actions:

### Pre-merge Checks

- **Migration validation:** Ensures migrations are generated correctly
- **Schema consistency:** Verifies schema files match migrations
- **SQL syntax:** Validates generated SQL

### Deployment Pipeline

```yaml
# Example workflow step
- name: Run database migrations
  run: npm run db:migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Multisite Support (Future)

The migration system is designed to support Discourse's multisite architecture:

### Current Setup
- Single database configuration
- Standard migration workflow

### Future Enhancements
- Per-site migration tracking
- Shared vs site-specific tables
- Migration coordination across sites

**Migration script is ready for multisite:** The `migrate.ts` script can be extended to:
1. Accept site identifier parameter
2. Switch database connection per site
3. Apply migrations to multiple databases

## Migration File Structure

```
drizzle/
├── meta/
│   ├── _journal.json          # Migration tracking
│   └── 0000_snapshot.json     # Schema snapshot
└── 0000_initial_schema.sql    # Migration SQL
```

### Migration Naming

Format: `NNNN_description.sql`
- `NNNN`: Sequential number (0000, 0001, 0002...)
- `description`: Auto-generated descriptive name

Example: `0001_add_user_display_name.sql`

## Examples

### Example 1: Add a new column

```typescript
// 1. Edit src/db/schema/users.ts
export const users = pgTable("users", {
  // ... existing columns
  bio: text("bio"), // New column
});

// 2. Generate migration
// $ npm run db:generate

// 3. Review generated SQL
// $ cat drizzle/0001_*.sql
// ALTER TABLE "users" ADD COLUMN "bio" text;

// 4. Apply migration
// $ npm run db:migrate
```

### Example 2: Create a new table

```typescript
// 1. Create src/db/schema/notifications.ts
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Export from src/db/schema/index.ts
export { notifications } from "./notifications";

// 3. Add to drizzle.config.ts schema array
// schema: [
//   "./src/db/schema/notifications.ts",
//   // ... other files
// ],

// 4. Generate and apply
// $ npm run db:generate
// $ npm run db:migrate
```

### Example 3: Add an index

```typescript
// 1. Edit schema with index
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    // ... other columns
  },
  (table) => ({
    // Add new index
    userIdIdx: index("posts_user_id_idx").on(table.userId),
  }),
);

// 2. Generate and apply
// $ npm run db:generate
// $ npm run db:migrate
```

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [Drizzle Migrations Guide](https://orm.drizzle.team/docs/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Discourse Database Schema](https://meta.discourse.org/t/database-schema/141)

## Getting Help

- **Schema questions:** Check `src/db/schema/` files for examples
- **Migration errors:** Review generated SQL in `drizzle/` folder
- **Database issues:** Run `npx tsx scripts/test-db-connection.ts`
- **Team support:** Open an issue with migration file and error output
