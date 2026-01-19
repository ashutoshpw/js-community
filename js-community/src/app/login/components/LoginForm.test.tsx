import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/utils";
import LoginForm from "./LoginForm";

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render all form fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should render forgot password link", () => {
    render(<LoginForm />);
    const forgotLink = screen.getByRole("link", {
      name: /forgot your password/i,
    });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/forgot-password");
  });

  it("should update form fields on user input", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const identifierInput = screen.getByLabelText(/email or username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(identifierInput, "testuser");
    await user.type(passwordInput, "TestPass123!");

    expect(identifierInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("TestPass123!");
  });

  it("should toggle password visibility", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleButton = screen.getByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should toggle remember me checkbox", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const checkbox = screen.getByLabelText(/remember me/i);
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should validate required fields on submit", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/email or username is required/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("should validate email format when @ is present", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const identifierInput = screen.getByLabelText(/email or username/i);
    await user.type(identifierInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("should validate username length", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const identifierInput = screen.getByLabelText(/email or username/i);
    await user.type(identifierInput, "ab"); // Too short

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("should submit form with valid credentials", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ user: { id: "1", email: "test@example.com" } }),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email or username/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "TestPass123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/sign-in",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "TestPass123!",
            rememberMe: false,
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("should display error message on failed login", async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email or username/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("should handle network errors gracefully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email or username/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "TestPass123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred during login/i),
      ).toBeInTheDocument();
    });
  });

  it("should show password strength indicator", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await user.type(passwordInput, "weak");

    await waitFor(() => {
      expect(screen.getByText(/weak password/i)).toBeInTheDocument();
    });
  });

  it("should implement rate limiting after multiple failed attempts", async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    };

    render(<LoginForm />);
    const user = userEvent.setup();

    // Simulate 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      await user.clear(screen.getByLabelText(/email or username/i));
      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(
        screen.getByLabelText(/email or username/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    }

    // After 5 attempts, should be blocked
    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /blocked/i });
      expect(submitButton).toBeDisabled();
      // Form inputs should also be disabled
      expect(screen.getByLabelText(/email or username/i)).toBeDisabled();
      expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
    });
  });

  it("should clear errors when user starts typing", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/email or username is required/i),
      ).toBeInTheDocument();
    });

    const identifierInput = screen.getByLabelText(/email or username/i);
    await user.type(identifierInput, "test");

    await waitFor(() => {
      expect(
        screen.queryByText(/email or username is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should disable form when blocked by rate limiting", async () => {
    // Pre-populate localStorage with blocked state
    const blockedUntil = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(
      "loginRateLimit",
      JSON.stringify({ attempts: 5, blockedUntil }),
    );

    render(<LoginForm />);

    const identifierInput = screen.getByLabelText(/email or username/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    const submitButton = screen.getByRole("button", { name: /blocked/i });

    expect(identifierInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(rememberMeCheckbox).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("should include rememberMe value in login request", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ user: { id: "1" } }),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email or username/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "TestPass123!");
    await user.click(screen.getByLabelText(/remember me/i));
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/sign-in",
        expect.objectContaining({
          body: JSON.stringify({
            email: "test@example.com",
            password: "TestPass123!",
            rememberMe: true,
          }),
        }),
      );
    });
  });

  it("should reset rate limit on successful login", async () => {
    // Pre-populate with some failed attempts
    localStorage.setItem(
      "loginRateLimit",
      JSON.stringify({ attempts: 3, blockedUntil: null }),
    );

    const mockResponse = {
      ok: true,
      json: async () => ({ user: { id: "1" } }),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email or username/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "TestPass123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    // Rate limit should be cleared
    expect(localStorage.getItem("loginRateLimit")).toBeNull();
  });
});
