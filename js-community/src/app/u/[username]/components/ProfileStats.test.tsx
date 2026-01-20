/**
 * Tests for ProfileStats component
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import ProfileStats from "./ProfileStats";

describe("ProfileStats", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    name: "Test User",
    trustLevel: 2,
    admin: false,
    moderator: false,
    active: true,
    suspended: false,
    createdAt: "2023-01-15T10:00:00.000Z",
    lastSeenAt: "2024-01-19T10:00:00.000Z",
  };

  const mockProfile = {
    location: "San Francisco",
    website: "https://example.com",
    bioRaw: "Hello world",
    bioCooked: "<p>Hello world</p>",
    avatarUrl: "https://example.com/avatar.jpg",
    profileBackgroundUrl: null,
    cardBackgroundUrl: null,
    views: 1234,
  };

  it("should render join date", () => {
    render(<ProfileStats user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Joined")).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2023/)).toBeInTheDocument();
  });

  it("should render profile views", () => {
    render(<ProfileStats user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Profile Views")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("should render trust level", () => {
    render(<ProfileStats user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Trust Level")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
  });

  it("should render location when provided", () => {
    render(<ProfileStats user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });

  it("should render website when provided", () => {
    render(<ProfileStats user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Website")).toBeInTheDocument();
    const websiteLink = screen.getByRole("link", {
      name: /example.com/,
    });
    expect(websiteLink).toHaveAttribute("href", "https://example.com");
    expect(websiteLink).toHaveAttribute("target", "_blank");
    expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should not render location when not provided", () => {
    const profileNoLocation = { ...mockProfile, location: null };
    render(<ProfileStats user={mockUser} profile={profileNoLocation} />);

    expect(screen.queryByText("Location")).not.toBeInTheDocument();
  });

  it("should not render website when not provided", () => {
    const profileNoWebsite = { ...mockProfile, website: null };
    render(<ProfileStats user={mockUser} profile={profileNoWebsite} />);

    expect(screen.queryByText("Website")).not.toBeInTheDocument();
  });

  it("should format last seen as 'Never' when null", () => {
    const userNoLastSeen = { ...mockUser, lastSeenAt: null };
    render(<ProfileStats user={userNoLastSeen} profile={mockProfile} />);

    expect(screen.getByText("Last Seen")).toBeInTheDocument();
    expect(screen.getByText("Never")).toBeInTheDocument();
  });
});
