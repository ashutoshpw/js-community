/**
 * Tests for forgot password page
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import ForgotPasswordPage from "./page";

describe("ForgotPasswordPage", () => {
  it("should render the main heading", () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByRole("heading", { name: /reset your password/i }),
    ).toBeInTheDocument();
  });

  it("should render instructions", () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByText(/enter your email address and we'll send you a link/i),
    ).toBeInTheDocument();
  });

  it("should render the forgot password form", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });
});
