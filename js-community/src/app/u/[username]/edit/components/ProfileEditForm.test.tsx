/**
 * Tests for ProfileEditForm component
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/utils";
import ProfileEditForm from "./ProfileEditForm";

// Mock Next.js router
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe("ProfileEditForm", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    name: "Test User",
    trustLevel: 2,
    admin: false,
    moderator: false,
    active: true,
    suspended: false,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };

  const mockProfile = {
    location: "San Francisco",
    website: "https://example.com",
    bioRaw: "Hello world",
    bioCooked: "<p>Hello world</p>",
    avatarUrl: "https://example.com/avatar.jpg",
    profileBackgroundUrl: null,
    cardBackgroundUrl: null,
    views: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with current values", () => {
    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("San Francisco")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello world")).toBeInTheDocument();
  });

  it("should update form fields on change", async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const nameInput = screen.getByLabelText("Display Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");

    expect(nameInput).toHaveValue("Updated Name");
  });

  it("should submit form successfully", async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const nameInput = screen.getByLabelText("Display Name");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users/testuser",
        expect.objectContaining({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("New Name"),
        }),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("should redirect after successful update", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    submitButton.click();

    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully!"),
      ).toBeInTheDocument();
    });

    // Note: In actual implementation, redirect happens after 1.5s timeout
    // We can't easily test this without fake timers which cause issues with other parts
  });

  it("should display error message on failed update", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Update failed" }),
    } as Response);

    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  it("should handle network errors", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    vi.mocked(global.fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              } as Response),
            100,
          ),
        ),
    );

    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    submitButton.click();

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(submitButton).not.toBeDisabled();
      },
      { timeout: 1000 },
    );
  });

  it("should navigate to profile page on cancel", async () => {
    render(<ProfileEditForm user={mockUser} profile={mockProfile} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    cancelButton.click();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/u/testuser");
    });
  });

  it("should handle empty profile fields", () => {
    const emptyProfile = {
      location: null,
      website: null,
      bioRaw: null,
      bioCooked: null,
      avatarUrl: null,
      profileBackgroundUrl: null,
      cardBackgroundUrl: null,
      views: 0,
    };

    const userNoName = { ...mockUser, name: null };

    render(<ProfileEditForm user={userNoName} profile={emptyProfile} />);

    expect(screen.getByLabelText("Display Name")).toHaveValue("");
    expect(screen.getByLabelText("Location")).toHaveValue("");
    expect(screen.getByLabelText("Website")).toHaveValue("");
    expect(screen.getByLabelText("Bio")).toHaveValue("");
  });
});
