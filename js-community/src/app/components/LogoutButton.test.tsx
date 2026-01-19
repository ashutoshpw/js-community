import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/utils";
import LogoutButton from "./LogoutButton";

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should render with default text", () => {
    render(<LogoutButton />);
    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it("should render with custom children", () => {
    render(<LogoutButton>Custom Logout</LogoutButton>);
    expect(
      screen.getByRole("button", { name: /custom logout/i }),
    ).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<LogoutButton className="custom-class">Logout</LogoutButton>);
    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toHaveClass("custom-class");
  });

  it("should call logout API on click", async () => {
    const mockResponse = {
      ok: true,
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    const button = screen.getByRole("button", { name: /sign out/i });
    await user.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/sign-out",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
  });

  it("should redirect to home page after successful logout", async () => {
    const mockResponse = {
      ok: true,
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("should show loading state during logout", async () => {
    const mockResponse = {
      ok: true,
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100)),
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    const button = screen.getByRole("button", { name: /sign out/i });
    await user.click(button);

    expect(
      screen.getByRole("button", { name: /signing out/i }),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should handle logout errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockResponse = {
      ok: false,
      text: async () => "Logout failed",
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Logout failed:",
        "Logout failed",
      );
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should handle network errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Logout error:",
        expect.any(Error),
      );
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should disable button during loading", async () => {
    const mockResponse = {
      ok: true,
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100)),
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    const button = screen.getByRole("button", { name: /sign out/i });
    await user.click(button);

    const loadingButton = screen.getByRole("button", { name: /signing out/i });
    expect(loadingButton).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
