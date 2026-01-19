# GitHub Copilot Custom Agents

This directory contains custom GitHub Copilot agents for the js-community project.

## Available Agents

### `@test-manager` - Test Manager Agent

**Purpose**: Automatically creates new tests or updates existing tests when features are created or modified.

**When to Use**:
- After creating a new component, utility function, or feature
- After modifying existing functionality that has test coverage
- When you need comprehensive test coverage for new code
- When refactoring code and need to update related tests

**Usage in GitHub Copilot**:

1. **In GitHub Copilot Chat** (Web, VS Code, or other supported IDE):
   ```
   @test-manager create tests for my new LoginForm component
   ```

2. **For new features**:
   ```
   @test-manager I just created a new utility function formatDate in src/lib/date-utils.ts, create comprehensive tests
   ```

3. **For modified features**:
   ```
   @test-manager I updated the user registration flow, please update the existing tests in src/app/signup/page.test.tsx
   ```

4. **For bulk test creation**:
   ```
   @test-manager analyze the recent changes and create/update all necessary tests
   ```

**What the Agent Does**:

✅ **Creates New Tests**:
- Analyzes new features and components
- Writes comprehensive test coverage (happy paths, edge cases, errors)
- Follows project conventions (Vitest, React Testing Library)
- Respects the 500-line file size limit

✅ **Updates Existing Tests**:
- Identifies affected test files when code changes
- Updates assertions and expectations
- Adds new test cases for new functionality
- Removes or updates obsolete tests

✅ **Follows Project Standards**:
- Uses Vitest and React Testing Library
- Co-locates tests with source files
- Uses proper TypeScript types
- Maintains 80% coverage thresholds
- Formats code with Biome

**Test Coverage Scope**:
- React Server Components (default in Next.js App Router)
- React Client Components (`'use client'`)
- Utility functions
- Database operations (Drizzle ORM)
- API routes and server actions
- Custom hooks
- Form validation
- Error handling

**Example Interactions**:

```
You: @test-manager create tests for src/app/topics/page.tsx

Agent: I'll create comprehensive tests for the Topics page. Let me first read the
component to understand what needs testing...

[Agent reads the file, identifies components, interactions, and edge cases]

Agent: I've created tests covering:
- Page rendering with topics list
- Empty state when no topics exist
- Navigation to individual topics
- Filter and search functionality
- Loading states
- Error handling

The tests are in src/app/topics/page.test.tsx
Run `bun test` to verify all tests pass.
```

## Agent Configuration

Agents are configured with YAML frontmatter and markdown instructions:

```yaml
---
name: agent-name
description: What the agent does
tools: ["read", "search", "edit", "write"]
---
```

## Enabling Agents

These agents are automatically available when:
1. You're using GitHub Copilot in a supported IDE (VS Code, Visual Studio, etc.)
2. The repository is open and `.github/agents/` directory exists
3. You reference the agent using `@agent-name` in Copilot Chat

## Creating New Agents

To create a new custom agent:

1. Create a new file: `.github/agents/[agent-name].agent.md`
2. Add YAML frontmatter with name, description, and tools
3. Write detailed instructions in markdown
4. Document the agent in this README

**File Naming Rules**:
- Only alphanumeric, dots, dashes, and underscores: `a-z A-Z 0-9 . - _`
- Must end with `.agent.md`

## Learn More

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Project Testing Guide](../../js-community/README.md#testing) (if exists)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## Feedback

If you have ideas for new agents or improvements to existing ones, please:
1. Open an issue describing the agent's purpose
2. Submit a PR with the new agent file
3. Update this README with usage examples
