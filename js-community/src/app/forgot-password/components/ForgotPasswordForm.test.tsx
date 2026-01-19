/**
 * Tests for forgot password form component
 */

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import ForgotPasswordForm from "./ForgotPasswordForm";

// Mock fetch globally
global.fetch = vi.fn();

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with email input", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("should validate email on submit", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("should show error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
    });
  });

  it("should submit valid email and show success message", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      }),
    } as Response);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/if an account exists with this email/i),
      ).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/password-reset/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@example.com" }),
    });
  });

  it("should handle rate limit error", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Too many password reset requests. Please try again later.",
      }),
    } as Response);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/too many password reset requests/i),
      ).toBeInTheDocument();
    });
  });

  it("should handle API errors", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: "Internal server error",
      }),
    } as Response);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });

  it("should handle network errors", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
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

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/sending/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should clear email input after successful submission", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Success",
      }),
    } as Response);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
    });
  });

  it("should clear errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    // Trigger validation error
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Start typing
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "t");

    // Error should be cleared
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});
