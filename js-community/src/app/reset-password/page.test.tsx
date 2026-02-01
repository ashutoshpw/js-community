/**
 * Tests for reset password page
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import ResetPasswordPage from "./page";

describe("ResetPasswordPage", () => {
  it("should render the main heading", async () => {
    const searchParams = Promise.resolve({ token: "test-token" });
    const page = await ResetPasswordPage({ searchParams });
    render(page);

    expect(
      screen.getByRole("heading", { name: /create new password/i }),
    ).toBeInTheDocument();
  });

  it("should render instructions", async () => {
    const searchParams = Promise.resolve({ token: "test-token" });
    const page = await ResetPasswordPage({ searchParams });
    render(page);

    expect(
      screen.getByText(/enter a new password for your account/i),
    ).toBeInTheDocument();
  });

  it("should render the reset password form", async () => {
    const searchParams = Promise.resolve({ token: "test-token" });
    const page = await ResetPasswordPage({ searchParams });
    render(page);

    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
  });
});
