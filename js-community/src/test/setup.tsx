import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock IntersectionObserver for framer-motion
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mock component for testing
  default: ({ src, alt, ...props }: any) => {
    // biome-ignore lint/performance/noImgElement: This is a test mock
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mock component for testing
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Note: NODE_ENV is automatically set to "test" by Vitest
