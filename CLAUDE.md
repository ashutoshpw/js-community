# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a Next.js 16 community platform (`js-community/`) that is migrating from a legacy Discourse (Ruby) application (`discourse/`). The focus is on building a modern JavaScript/TypeScript community forum using Next.js App Router.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Runtime**: Bun (preferred) / Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS v4
- **Linting/Formatting**: Biome
- **React**: 19.2.3
- **Git Hooks**: Lefthook

## Common Commands

All commands should be run from the `js-community/` directory unless otherwise specified.

### Development
```bash
cd js-community
bun install              # Install dependencies (preferred)
bun dev                  # Start development server (http://localhost:3000)
bun run build            # Build for production
bun start                # Start production server
```

### Code Quality
```bash
bun run lint             # Run Biome linter
bun run format           # Format code with Biome
bun run lint:lines       # Check for files exceeding 500-line limit
```

### Database (Drizzle ORM)
```bash
bun run db:generate      # Generate migrations from schema
bun run db:migrate       # Run migrations
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio (database GUI)
```

### Git Hooks (Lefthook)
Pre-commit hooks automatically run:
- File line limit checker (500 lines max for `js-community/**/*.{js,jsx,ts,tsx}`)
- Build verification (`bun run build` in js-community/)

## Architecture

### Database Layer

The project uses a custom database abstraction layer built on top of Drizzle ORM, located in `js-community/src/lib/db/`:

- **`database.ts`**: Main database connection and Drizzle ORM setup
- **`schema.ts`**: Drizzle schema definitions
- **`queries.ts`**: Query builder helpers for SELECT, INSERT, UPDATE, DELETE
- **`transaction.ts`**: Transaction management, savepoints, and batch operations
- **`errors.ts`**: Custom error types (DatabaseError, QueryError, ConnectionError, etc.) with retry logic
- **`types.ts`**: TypeScript types for pagination, filters, query options
- **`index.ts`**: Central export for all database utilities

#### Database Utilities

Import from `@/lib/db`:
```typescript
import {
  buildSelectQuery,    // Build parameterized SELECT queries
  buildInsertQuery,    // Build INSERT queries
  buildUpdateQuery,    // Build UPDATE queries
  buildDeleteQuery,    // Build DELETE queries
  withTransaction,     // Execute operations in a transaction
  createPaginatedResult, // Create paginated responses
  retryQuery,          // Retry with exponential backoff
} from '@/lib/db';
```

Key features:
- Parameterized query builders prevent SQL injection
- Transaction support with savepoints
- Pagination helpers
- Error handling with typed errors
- Retry logic for transient failures

### App Structure

The application uses Next.js App Router:
- **`src/app/`**: Pages and layouts (App Router)
- **`src/app/components/`**: Shared React components
- **`src/lib/`**: Utility functions and database layer
- **`public/`**: Static assets

### Configuration Files

- **`biome.json`**: Biome linter/formatter config (2-space indent, React/Next.js domains)
- **`next.config.ts`**: Next.js configuration
- **`tsconfig.json`**: TypeScript config with `@/*` path alias to `./src/*`
- **`drizzle.config.ts`**: Drizzle ORM configuration
- **`postcss.config.mjs`**: PostCSS with TailwindCSS v4
- **`lefthook.yml`** (root): Pre-commit hooks configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/js_community
```

## Code Standards

### File Size Limits
- Maximum 500 lines per file (enforced by pre-commit hook)
- If exceeded, refactor into smaller modules or extract helpers

### TypeScript
- Use TypeScript for all new code with proper type annotations
- Leverage the `@/*` path alias for imports from `src/`

### React/Next.js Patterns
- Use Server Components by default
- Add `'use client'` directive only when client-side interactivity is needed
- Leverage Next.js built-in optimizations (Image, Font, etc.)
- Follow React 19 best practices

### Styling
- Use TailwindCSS v4 utility classes
- Follow the formatting defined in `biome.json`

### Database Operations
- Use the query builders from `@/lib/db` for type-safe, parameterized queries
- Wrap multi-step operations in transactions using `withTransaction`
- Use typed error handling from `@/lib/db/errors`
- Implement pagination for large result sets

### Git Workflow
- Lefthook automatically runs checks on pre-commit
- Ensure `bun run build` passes before committing
- Keep files under 500 lines (checked automatically)

## Migration from Discourse

When migrating features from the Discourse (Ruby) codebase:
- Maintain feature parity where possible
- Adapt to modern React patterns and Next.js best practices
- Document any behavioral differences
- The `discourse/` directory is available for reference but is excluded from line limit checks

## Deployment

The project uses Vercel with custom build logic:
- **`scripts/ignore-build.js`**: Skips builds for draft PRs on Vercel
- GitHub Actions workflow checks file line limits (`.github/workflows/file-line-limits.yml`)
