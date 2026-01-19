import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import AboutPage from "./page";

describe("About Page", () => {
  it("should render the main heading", () => {
    render(<AboutPage />);
    const heading = screen.getByRole("heading", {
      name: /about js community/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render the tagline", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(
        /empowering javascript developers to learn, share, and grow together/i,
      ),
    ).toBeInTheDocument();
  });

  it("should render mission section", () => {
    render(<AboutPage />);
    const missionHeading = screen.getByRole("heading", {
      name: /our mission/i,
      level: 2,
    });
    expect(missionHeading).toBeInTheDocument();
    expect(
      screen.getByText(/knowledge grows when shared/i),
    ).toBeInTheDocument();
  });

  it("should render values section", () => {
    render(<AboutPage />);
    const valuesHeading = screen.getByRole("heading", {
      name: /our values/i,
      level: 2,
    });
    expect(valuesHeading).toBeInTheDocument();
    expect(
      screen.getByText(/these principles guide everything we do/i),
    ).toBeInTheDocument();
  });

  it("should render team section", () => {
    render(<AboutPage />);
    const teamHeading = screen.getByRole("heading", {
      name: /meet our team/i,
      level: 2,
    });
    expect(teamHeading).toBeInTheDocument();
    expect(screen.getByText(/alex rivera/i)).toBeInTheDocument();
    expect(screen.getByText(/sarah chen/i)).toBeInTheDocument();
  });

  it("should render statistics section", () => {
    render(<AboutPage />);
    const statsHeading = screen.getByRole("heading", {
      name: /our impact/i,
      level: 2,
    });
    expect(statsHeading).toBeInTheDocument();
    expect(
      screen.getByText(/growing together, one developer at a time/i),
    ).toBeInTheDocument();
  });

  it("should render timeline section", () => {
    render(<AboutPage />);
    const timelineHeading = screen.getByRole("heading", {
      name: /our journey/i,
      level: 2,
    });
    expect(timelineHeading).toBeInTheDocument();
    expect(screen.getByText(/the beginning/i)).toBeInTheDocument();
  });

  it("should render contact section", () => {
    render(<AboutPage />);
    const contactHeading = screen.getByRole("heading", {
      name: /get in touch/i,
      level: 2,
    });
    expect(contactHeading).toBeInTheDocument();
    expect(screen.getByText(/general inquiries/i)).toBeInTheDocument();
    expect(
      screen.getByText(/hello@jscommunity\.example\.com/i),
    ).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<AboutPage />);
    const connectHeading = screen.getByRole("heading", {
      name: /connect with us/i,
      level: 3,
    });
    expect(connectHeading).toBeInTheDocument();
    const discordElements = screen.getAllByText(/discord/i);
    expect(discordElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/youtube/i)).toBeInTheDocument();
    expect(screen.getByText(/linkedin/i)).toBeInTheDocument();
  });

  it("should render call-to-action section", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/ready to join the community\?/i),
    ).toBeInTheDocument();
    const getStartedButton = screen.getByRole("link", {
      name: /get started/i,
    });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute("href", "/signup");
  });

  it("should have privacy policy link", () => {
    render(<AboutPage />);
    const privacyLink = screen.getByRole("link", {
      name: /privacy policy/i,
    });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("should render all team members", () => {
    render(<AboutPage />);
    expect(screen.getByText(/alex rivera/i)).toBeInTheDocument();
    expect(screen.getByText(/sarah chen/i)).toBeInTheDocument();
    expect(screen.getByText(/marcus johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/priya sharma/i)).toBeInTheDocument();
  });

  it("should render team member roles", () => {
    render(<AboutPage />);
    expect(screen.getByText(/founder & lead developer/i)).toBeInTheDocument();
    expect(screen.getByText(/community manager/i)).toBeInTheDocument();
    expect(screen.getByText(/technical lead/i)).toBeInTheDocument();
    expect(screen.getByText(/developer experience/i)).toBeInTheDocument();
  });

  it("should render all core values", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: /our values/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/innovation/i)).toBeInTheDocument();
    expect(screen.getByText(/transparency/i)).toBeInTheDocument();
    expect(screen.getByText(/continuous learning/i)).toBeInTheDocument();
  });

  it("should render milestone information", () => {
    render(<AboutPage />);
    expect(screen.getByText(/key milestones/i)).toBeInTheDocument();
    expect(screen.getByText(/launch of js community/i)).toBeInTheDocument();
  });
});
