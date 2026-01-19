# Testing Guide

This project uses [Vitest](https://vitest.dev) as the testing framework along with [React Testing Library](https://testing-library.com/react) for component testing.

## Table of Contents

- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Patterns](#testing-patterns)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

## Getting Started

### Installation

All testing dependencies are already installed in the project:

- `vitest` - Fast unit test framework
- `@vitest/ui` - Web-based UI for viewing test results
- `jsdom` - DOM implementation for testing React components
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - Simulate user interactions

### Configuration

Testing is configured in `vitest.config.ts` with:

- **Environment**: jsdom (for DOM testing)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)
- **Coverage**: v8 provider with 80% thresholds
- **Path Aliases**: `@/*` resolves to `src/*` (matching tsconfig)

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open Vitest UI in browser
npm run test:ui
```

## Writing Tests

### File Naming Convention

Test files should be placed next to the code they test:

- Unit tests: `*.test.ts` or `*.test.tsx`
- Component tests: `*.test.tsx`
- Integration tests: `*.test.ts` or `*.test.tsx`

### Example: Unit Test

```typescript
// src/lib/utils.test.ts
import { describe, expect, it } from "vitest";
import { formatFullName } from "./utils";

describe("formatFullName", () => {
  it("should combine first and last name", () => {
    expect(formatFullName("John", "Doe")).toBe("John Doe");
  });

  it("should handle empty strings", () => {
    expect(formatFullName("", "")).toBe("");
  });
});
```

### Example: Component Test

```typescript
// src/components/Button.test.tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import Button from "./Button";

describe("Button Component", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole("button");
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Example: API Route Test

```typescript
// src/app/api/users/route.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/users", () => {
  it("should return users list", async () => {
    const request = new Request("http://localhost:3000/api/users");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## Testing Patterns

### Using Test Utilities

Import from `@/test/utils` instead of directly from `@testing-library/react`:

```typescript
import { render, screen, userEvent } from "@/test/utils";
```

This ensures consistent test setup across the project.

### Mocking Next.js Components

Next.js components are automatically mocked in `src/test/setup.ts`:

- `next/navigation` - useRouter, usePathname, useSearchParams, useParams
- `next/image` - Image component
- `next/link` - Link component

### Custom Mocks

For additional mocks, add them to `src/test/setup.ts` or create them in your test file:

```typescript
import { vi } from "vitest";

// Mock a module
vi.mock("./api", () => ({
  fetchUsers: vi.fn(() => Promise.resolve([])),
}));

// Mock a function
const mockFn = vi.fn();

// Spy on a function
const spy = vi.spyOn(console, "log");
```

### Async Testing

Use `async/await` for asynchronous tests:

```typescript
it("should handle async operations", async () => {
  render(<AsyncComponent />);
  
  // Wait for element to appear
  const element = await screen.findByText("Loaded");
  expect(element).toBeInTheDocument();
});
```

### Testing User Interactions

Use `userEvent` for realistic user interactions:

```typescript
import { userEvent } from "@/test/utils";

it("should handle user input", async () => {
  render(<Form />);
  
  const input = screen.getByRole("textbox");
  await userEvent.type(input, "Hello, World!");
  
  expect(input).toHaveValue("Hello, World!");
});
```

## Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Text summary in console
- **HTML**: Interactive report in `coverage/` directory
- **JSON**: Machine-readable `coverage.json`
- **LCOV**: `coverage/lcov.info` for CI integration

### Coverage Thresholds

The project enforces minimum coverage thresholds:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

Tests will fail if coverage falls below these thresholds.

### Excluding from Coverage

Add patterns to `coverage.exclude` in `vitest.config.ts`:

```typescript
coverage: {
  exclude: [
    "node_modules/",
    "**/*.config.{ts,js}",
    "**/*.d.ts",
    // Add more patterns here
  ],
}
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing implementation details

```typescript
it("should have a useState hook", () => {
  // Don't test React internals
});
```

✅ **Good**: Testing user-facing behavior

```typescript
it("should update count when button is clicked", async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole("button"));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

Prefer queries that mirror how users interact with your app:

1. `getByRole` (best)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

```typescript
// Good
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText("Email");

// Avoid when possible
screen.getByTestId("submit-button");
```

### 3. Write Descriptive Test Names

```typescript
// Good
it("should display error message when email is invalid", () => {});

// Bad
it("works", () => {});
```

### 4. Arrange-Act-Assert Pattern

```typescript
it("should add item to cart", async () => {
  // Arrange
  render(<ShoppingCart />);
  const addButton = screen.getByRole("button", { name: /add to cart/i });

  // Act
  await userEvent.click(addButton);

  // Assert
  expect(screen.getByText("1 item in cart")).toBeInTheDocument();
});
```

### 5. Keep Tests Independent

Each test should be independent and not rely on other tests:

```typescript
// Good - Each test is isolated
describe("TodoList", () => {
  it("should add a todo", () => {
    render(<TodoList />);
    // Add todo logic
  });

  it("should delete a todo", () => {
    render(<TodoList />);
    // Delete todo logic (doesn't depend on previous test)
  });
});
```

### 6. Clean Up After Tests

The test setup automatically cleans up after each test, but if you create side effects:

```typescript
import { afterEach } from "vitest";

afterEach(() => {
  // Clean up side effects
  localStorage.clear();
  sessionStorage.clear();
});
```

### 7. Mock External Dependencies

```typescript
// Mock API calls
vi.mock("./api", () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: [] })),
}));

// Mock environment variables
beforeEach(() => {
  process.env.API_URL = "http://localhost:3000";
});
```

## Testing Philosophy

**All new features MUST include tests:**

1. **Unit Tests**: Test individual functions and utilities
2. **Component Tests**: Test React components in isolation
3. **Integration Tests**: Test API routes and database operations
4. **Coverage Goal**: Maintain >80% code coverage

Write tests **alongside** implementation, not after. This ensures:

- Better code design
- Faster feedback
- Higher confidence in changes
- Easier refactoring

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest UI Guide](https://vitest.dev/guide/ui.html)

## Troubleshooting

### Tests are slow

- Use `vi.mock()` to mock expensive operations
- Avoid unnecessary re-renders
- Use `screen.findBy*` queries sparingly (they wait for elements)

### Can't find element

- Use `screen.debug()` to see what's rendered
- Check if element appears asynchronously (use `findBy*` instead of `getBy*`)
- Verify element is actually rendered

### Mock not working

- Ensure mock is called before importing the module
- Check mock is in correct scope (file vs. test)
- Verify mock path matches import path

---

**Happy Testing! 🧪**
