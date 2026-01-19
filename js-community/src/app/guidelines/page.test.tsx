import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import CommunityGuidelines from "./page";

describe("Community Guidelines Page", () => {
  it("should render the main heading", () => {
    render(<CommunityGuidelines />);
    const heading = screen.getByRole("heading", {
      name: /community guidelines/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should display version and effective date", () => {
    render(<CommunityGuidelines />);
    const versionText = screen.getByText(
      /version 1\.0\.0 \| effective date: january 1, 2026/i,
    );
    expect(versionText).toBeInTheDocument();
  });

  describe("Code of Conduct Section", () => {
    it("should render code of conduct section", () => {
      render(<CommunityGuidelines />);
      const codeOfConductHeading = screen.getByRole("heading", {
        name: /1\. code of conduct/i,
      });
      expect(codeOfConductHeading).toBeInTheDocument();
    });

    it("should list expected behaviors", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/1\.1 expected behavior/i)).toBeInTheDocument();
      expect(screen.getAllByText(/be respectful/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/be inclusive/i)).toBeInTheDocument();
      expect(screen.getByText(/be collaborative/i)).toBeInTheDocument();
    });

    it("should list unacceptable behaviors", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/1\.2 unacceptable behavior/i),
      ).toBeInTheDocument();
      expect(screen.getAllByText(/harassment/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/discrimination/i)).toBeInTheDocument();
      expect(screen.getAllByText(/hate speech/i).length).toBeGreaterThan(0);
    });

    it("should mention inclusive language", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/1\.3 inclusive language/i)).toBeInTheDocument();
    });
  });

  describe("Content Policy Section", () => {
    it("should render content policy section", () => {
      render(<CommunityGuidelines />);
      const contentPolicyHeading = screen.getByRole("heading", {
        name: /2\. content policy/i,
      });
      expect(contentPolicyHeading).toBeInTheDocument();
    });

    it("should list acceptable content types", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/2\.1 acceptable content/i)).toBeInTheDocument();
      expect(screen.getByText(/technical discussions/i)).toBeInTheDocument();
      expect(screen.getByText(/learning resources/i)).toBeInTheDocument();
    });

    it("should list prohibited content", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/2\.2 prohibited content/i)).toBeInTheDocument();
      expect(screen.getAllByText(/illegal content/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/spam/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/malicious code/i)).toBeInTheDocument();
    });

    it("should mention content quality standards", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/2\.3 content quality standards/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/use clear titles/i)).toBeInTheDocument();
    });

    it("should address intellectual property", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/2\.4 intellectual property/i),
      ).toBeInTheDocument();
    });
  });

  describe("Moderation Section", () => {
    it("should render moderation section", () => {
      render(<CommunityGuidelines />);
      const moderationHeading = screen.getByRole("heading", {
        name: /3\. moderation/i,
      });
      expect(moderationHeading).toBeInTheDocument();
    });

    it("should explain moderator responsibilities", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/3\.1 moderator responsibilities/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/enforcing these community guidelines/i),
      ).toBeInTheDocument();
    });

    it("should describe moderation process", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/3\.2 moderation process/i)).toBeInTheDocument();
    });

    it("should explain moderator authority", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/3\.3 moderator authority/i)).toBeInTheDocument();
    });

    it("should describe appeals process", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/3\.4 appeals process/i)).toBeInTheDocument();
      expect(
        screen.getAllByText(/moderation@jscommunity\.example\.com/i).length,
      ).toBeGreaterThan(0);
    });
  });

  describe("Reporting Section", () => {
    it("should render reporting violations section", () => {
      render(<CommunityGuidelines />);
      const reportingHeading = screen.getByRole("heading", {
        name: /4\. reporting violations/i,
      });
      expect(reportingHeading).toBeInTheDocument();
    });

    it("should explain how to report", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/4\.1 how to report/i)).toBeInTheDocument();
      expect(screen.getByText(/report button/i)).toBeInTheDocument();
      expect(
        screen.getAllByText(/report@jscommunity\.example\.com/i).length,
      ).toBeGreaterThan(0);
    });

    it("should explain what to include in a report", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/4\.2 what to include in a report/i),
      ).toBeInTheDocument();
    });

    it("should mention report response times", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/4\.3 report response time/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/urgent reports/i)).toBeInTheDocument();
    });

    it("should address confidentiality", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/4\.4 confidentiality/i)).toBeInTheDocument();
    });

    it("should mention emergency situations", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/4\.5 emergency situations/i),
      ).toBeInTheDocument();
    });
  });

  describe("Enforcement Section", () => {
    it("should render enforcement section", () => {
      render(<CommunityGuidelines />);
      const enforcementHeading = screen.getByRole("heading", {
        name: /5\. enforcement/i,
      });
      expect(enforcementHeading).toBeInTheDocument();
    });

    it("should list enforcement actions", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/5\.1 enforcement actions/i)).toBeInTheDocument();
      expect(screen.getAllByText(/content removal/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/warning/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/temporary suspension/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/permanent ban/i).length).toBeGreaterThan(0);
    });

    it("should explain violation severity levels", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/5\.2 violation severity levels/i),
      ).toBeInTheDocument();
      expect(screen.getAllByText(/minor violations/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/moderate violations/i)).toBeInTheDocument();
      expect(screen.getByText(/severe violations/i)).toBeInTheDocument();
      expect(screen.getAllByText(/critical violations/i).length).toBeGreaterThan(0);
    });

    it("should describe notification process", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/5\.3 notification process/i),
      ).toBeInTheDocument();
    });

    it("should address repeat offenders", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/5\.4 repeat offenders/i)).toBeInTheDocument();
    });

    it("should explain account reinstatement", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/5\.5 account reinstatement/i),
      ).toBeInTheDocument();
    });
  });

  describe("FAQ Section", () => {
    it("should render FAQ section", () => {
      render(<CommunityGuidelines />);
      const faqHeading = screen.getByRole("heading", {
        name: /6\. frequently asked questions/i,
      });
      expect(faqHeading).toBeInTheDocument();
    });

    it("should include question about reporting violations", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(
          /what should i do if i see content that violates the guidelines/i,
        ),
      ).toBeInTheDocument();
    });

    it("should include question about self-promotion", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/can i promote my own projects or products/i),
      ).toBeInTheDocument();
    });

    it("should include question about harassment", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/what counts as harassment/i),
      ).toBeInTheDocument();
    });

    it("should include question about appeals", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/how do i appeal a moderation decision/i),
      ).toBeInTheDocument();
    });

    it("should include question about profanity", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/can i use profanity in my posts/i),
      ).toBeInTheDocument();
    });

    it("should include question about job postings", () => {
      render(<CommunityGuidelines />);
      expect(screen.getByText(/are job postings allowed/i)).toBeInTheDocument();
    });
  });

  describe("Contact Information", () => {
    it("should render contact information section", () => {
      render(<CommunityGuidelines />);
      const contactHeading = screen.getByRole("heading", {
        name: /7\. contact information/i,
      });
      expect(contactHeading).toBeInTheDocument();
    });

    it("should list all contact emails", () => {
      render(<CommunityGuidelines />);
      expect(
        screen.getByText(/community@jscommunity\.example\.com/i),
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(/report@jscommunity\.example\.com/i).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(/moderation@jscommunity\.example\.com/i).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(/urgent@jscommunity\.example\.com/i).length,
      ).toBeGreaterThan(0);
    });
  });

  it("should have version history section", () => {
    render(<CommunityGuidelines />);
    const versionHistoryHeading = screen.getByRole("heading", {
      name: /version history/i,
    });
    expect(versionHistoryHeading).toBeInTheDocument();
    expect(
      screen.getByText(/initial version of community guidelines/i),
    ).toBeInTheDocument();
  });

  it("should display thank you message", () => {
    render(<CommunityGuidelines />);
    expect(
      screen.getByText(/thank you for being part of our community/i),
    ).toBeInTheDocument();
  });

  it("should display last updated date", () => {
    render(<CommunityGuidelines />);
    expect(
      screen.getByText(/last updated: january 1, 2026/i),
    ).toBeInTheDocument();
  });
});
