/**
 * Tests for ProfileHeader component
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import ProfileHeader from "./ProfileHeader";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock fetch
global.fetch = vi.fn();

describe("ProfileHeader", () => {
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
    // Setup default mock for fetch to avoid errors
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
    } as Response);
  });

  it("should render user information", () => {
    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("should display trust level badge", () => {
    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Member")).toBeInTheDocument();
  });

  it("should display admin badge when user is admin", () => {
    const adminUser = { ...mockUser, admin: true };
    render(<ProfileHeader user={adminUser} profile={mockProfile} />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("should display moderator badge when user is moderator", () => {
    const modUser = { ...mockUser, moderator: true };
    render(<ProfileHeader user={modUser} profile={mockProfile} />);

    expect(screen.getByText("Moderator")).toBeInTheDocument();
  });

  it("should display avatar image when avatarUrl is provided", () => {
    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    const avatar = screen.getByAltText("testuser");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", mockProfile.avatarUrl);
  });

  it("should display username initial when no avatar URL", () => {
    const profileNoAvatar = { ...mockProfile, avatarUrl: null };
    render(<ProfileHeader user={mockUser} profile={profileNoAvatar} />);

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should show edit button for own profile", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1 } }),
    } as Response);

    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });
  });

  it("should not show edit button for other users' profiles", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 999 } }),
    } as Response);

    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    await waitFor(() => {
      expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
    });
  });

  it("should not show edit button when not authenticated", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    await waitFor(() => {
      expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
    });
  });

  it("should handle session check errors gracefully", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    render(<ProfileHeader user={mockUser} profile={mockProfile} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});
