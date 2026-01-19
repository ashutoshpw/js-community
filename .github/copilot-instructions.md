# JS Community - GitHub Copilot Instructions

This is a Next.js 16 project using Bun as the package manager and runtime. The repository is migrating a Discourse (Ruby-based) community platform to a modern JavaScript/TypeScript stack within the `js-community` folder.

## Project Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Runtime**: Node.js/Bun
- **Styling**: TailwindCSS v4
- **Linter/Formatter**: Biome
- **Migration Context**: Transitioning from Discourse (Ruby) to Next.js

## Code Standards

### Required Before Each Commit
- Run `bun run lint` to check code quality with Biome
- Run `bun run format` to format code with Biome
- Ensure TypeScript compilation passes without errors
- **Run `npm test` to ensure all tests pass**

**Note**: Pre-commit hooks automatically run tests, linting, and build verification. Tests must pass before commits are allowed.

### Development Flow
- **Install dependencies**: `bun install` (preferred) or `npm install`
- **Development server**: `bun dev` or `npm run dev` (starts on http://localhost:3000)
- **Build**: `bun run build` or `npm run build`
- **Production server**: `bun start` or `npm start`
- **Lint**: `bun run lint` or `npm run lint`
- **Format**: `bun run format` or `npm run format`
- **Test**: `npm test` or `npm run test:watch` (watch mode)
- **Coverage**: `npm run test:coverage` (generates coverage report)

## Repository Structure

- `js-community/`: Main Next.js application directory
  - `src/app/`: Next.js App Router pages and layouts
  - `src/lib/`: Shared utilities and business logic
  - `src/test/`: Test utilities and setup files
  - `docs/`: **All project documentation** (guides, conventions, architecture docs)
  - `public/`: Static assets
  - `biome.json`: Biome linter and formatter configuration
  - `next.config.ts`: Next.js configuration
  - `tsconfig.json`: TypeScript configuration
  - `vitest.config.ts`: Vitest testing configuration
  - `postcss.config.mjs`: PostCSS and TailwindCSS v4 configuration
- `discourse/`: Legacy Discourse (Ruby) application files
- `scripts/`: Build and deployment scripts
  - `ignore-build.js`: Vercel build skip logic for draft PRs

## Key Guidelines

1. **Use Bun**: Prefer Bun commands (`bun install`, `bun dev`) over npm/yarn/pnpm when possible
2. **TypeScript**: All new code should be written in TypeScript with proper type annotations
3. **Next.js App Router**: Use the App Router paradigm (Server Components by default, Client Components when needed)
4. **Biome for Code Quality**: Follow Biome's recommended rules for React and Next.js
5. **Component Organization**: Keep components modular and reusable
6. **Styling**: Use TailwindCSS utility classes for styling
7. **Code Formatting**: 
   - Use 2 spaces for indentation
   - Follow the formatting rules defined in `biome.json`
8. **Imports**: Organize imports logically (Biome will auto-organize on save)
9. **Testing**: 
   - **REQUIRED**: Write tests for ALL new features alongside implementation
   - Unit tests for utilities and business logic
   - Component tests for React components
   - Integration tests for API routes
   - Maintain >80% code coverage
   - Tests run automatically in pre-commit hooks and CI/CD
   - See `docs/TESTING.md` for detailed guidelines
10. **Documentation**: 
    - Create all documentation in the `js-community/docs/` directory
    - **DO NOT** create documentation files (e.g., `*.md` guides) in the root `js-community/` directory
    - Use descriptive names for documentation files (e.g., `TESTING.md`, `CONTRIBUTING.md`, `API.md`)
    - Update the main `README.md` with links to relevant documentation in `docs/`
    - Keep `README.md` concise and use it as an entry point to more detailed docs

## Migration Guidelines

- When migrating features from Discourse, maintain feature parity where possible
- Document any breaking changes or differences in behavior
- Consider modern React patterns and Next.js best practices when reimplementing features
- Preserve user data and experience during migration

## Common Patterns

- Use Server Components by default for better performance
- Add `'use client'` directive only when client-side interactivity is needed
- Leverage Next.js built-in optimizations (Image, Font, etc.)
- Use TypeScript interfaces for component props and data structures
- Follow React 19 best practices for hooks and component lifecycle

## Testing Requirements

This project uses **Vitest** with React Testing Library. All new code MUST include tests.

### Test File Location
- Place test files next to the code they test
- Use `.test.ts` for utility/logic tests
- Use `.test.tsx` for component tests

### Testing Standards
1. **Unit Tests**: Test individual functions and utilities in isolation
2. **Component Tests**: Test React components using React Testing Library
3. **Integration Tests**: Test API routes and database operations
4. **Coverage**: Maintain >80% coverage for lines, branches, functions, and statements

### Automated Testing
- **Pre-commit Hook**: Tests run automatically before each commit via Lefthook
- **GitHub Actions**: Tests run on every PR to main branch
- **Coverage Reports**: Automatically generated and commented on PRs

### Quick Commands
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
npm run test:ui       # Open Vitest UI
```

See `docs/TESTING.md` for comprehensive testing guidelines and examples.
