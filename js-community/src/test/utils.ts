import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Custom render function for React Testing Library
 * Wraps components with common providers and setup
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  // For now, we just use the default render
  // In the future, you can add custom providers here (e.g., Redux, Theme, etc.)
  return render(ui, options);
}

/**
 * Re-export everything from React Testing Library
 */
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

/**
 * Custom matcher utilities
 */
export { renderWithProviders as render };
