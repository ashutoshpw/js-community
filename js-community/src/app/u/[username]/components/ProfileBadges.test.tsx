/**
 * Tests for ProfileBadges component
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import ProfileBadges from "./ProfileBadges";

describe("ProfileBadges", () => {
  const mockBadges = [
    {
      id: 1,
      badgeId: 1,
      grantedAt: "2023-06-15T10:00:00.000Z",
      featured: 1,
      badgeName: "First Post",
      badgeDescription: "Made your first post",
      badgeIcon: "✍️",
      badgeImageUrl: null,
    },
    {
      id: 2,
      badgeId: 2,
      grantedAt: "2023-07-20T10:00:00.000Z",
      featured: 0,
      badgeName: "Regular",
      badgeDescription: "Visited the site regularly",
      badgeIcon: null,
      badgeImageUrl: "https://example.com/badge.png",
    },
  ];

  it("should render badges with count", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText("Badges (2)")).toBeInTheDocument();
  });

  it("should render badge names", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("should render badge descriptions", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText("Made your first post")).toBeInTheDocument();
    expect(screen.getByText("Visited the site regularly")).toBeInTheDocument();
  });

  it("should display badge icon when available", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText("✍️")).toBeInTheDocument();
  });

  it("should display badge image when available", () => {
    render(<ProfileBadges badges={mockBadges} />);

    const badgeImage = screen.getByAltText("Regular");
    expect(badgeImage).toBeInTheDocument();
    expect(badgeImage).toHaveAttribute("src", "https://example.com/badge.png");
  });

  it("should show featured badge indicator", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("should display earned date", () => {
    render(<ProfileBadges badges={mockBadges} />);

    expect(screen.getByText(/Earned 6\/15\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Earned 7\/20\/2023/)).toBeInTheDocument();
  });

  it("should return null when no badges", () => {
    const { container } = render(<ProfileBadges badges={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render default trophy icon when no icon or image", () => {
    const badgeNoIcon = [
      {
        id: 3,
        badgeId: 3,
        grantedAt: "2023-08-01T10:00:00.000Z",
        featured: 0,
        badgeName: "Newbie",
        badgeDescription: "Welcome!",
        badgeIcon: null,
        badgeImageUrl: null,
      },
    ];

    render(<ProfileBadges badges={badgeNoIcon} />);

    expect(screen.getByText("🏆")).toBeInTheDocument();
  });
});
