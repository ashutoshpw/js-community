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

### Development Flow
- **Install dependencies**: `bun install` (preferred) or `npm install`
- **Development server**: `bun dev` or `npm run dev` (starts on http://localhost:3000)
- **Build**: `bun run build` or `npm run build`
- **Production server**: `bun start` or `npm start`
- **Lint**: `bun run lint` or `npm run lint`
- **Format**: `bun run format` or `npm run format`

## Repository Structure

- `js-community/`: Main Next.js application directory
  - `src/app/`: Next.js App Router pages and layouts
  - `public/`: Static assets
  - `biome.json`: Biome linter and formatter configuration
  - `next.config.ts`: Next.js configuration
  - `tsconfig.json`: TypeScript configuration
  - `tailwind.config.js`: TailwindCSS configuration
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
9. **Testing**: Write tests for new functionality when appropriate
10. **Documentation**: Update relevant documentation when making significant changes

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
