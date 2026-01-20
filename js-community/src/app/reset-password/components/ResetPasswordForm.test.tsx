/**
 * Tests for reset password form component
 */

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import ResetPasswordForm from "./ResetPasswordForm";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("ResetPasswordForm", () => {
  const mockToken = "test-token-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with password inputs", () => {
    render(<ResetPasswordForm token={mockToken} />);

    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("should validate password on submit", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("should show error for weak password", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "weak");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "weak");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      const errorElements = screen.getAllByText(/at least 8 characters/i);
      expect(errorElements.length).toBeGreaterThan(0);
      expect(errorElements[0]).toBeInTheDocument();
    });
  });

  it("should show error when passwords don't match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "DifferentPass123!");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const showButtons = screen.getAllByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(showButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "text");

    const hideButtons = screen.getAllByRole("button", { name: /hide/i });
    await user.click(hideButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should submit valid password and redirect", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Password has been reset successfully",
      }),
    } as Response);

    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "ValidPass123!");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login?reset=success");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/password-reset/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: mockToken,
        password: "ValidPass123!",
      }),
    });
  });

  it("should handle API errors", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "Token has expired",
      }),
    } as Response);

    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "ValidPass123!");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/token has expired/i)).toBeInTheDocument();
    });
  });

  it("should handle network errors", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "ValidPass123!");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    // Delay the response
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ message: "Success" }),
              } as Response),
            100,
          ),
        ),
    );

    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    await user.type(confirmPasswordInput, "ValidPass123!");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/resetting/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it("should display password strength indicator", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "ValidPass123!");

    await waitFor(() => {
      // Password strength indicator should be visible
      expect(screen.getByText(/strong password/i)).toBeInTheDocument();
    });
  });

  it("should clear errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token={mockToken} />);

    // Trigger validation error
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Start typing
    const passwordInput = screen.getByLabelText(/^new password$/i);
    await user.type(passwordInput, "V");

    // Error should be cleared
    expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
  });
});
