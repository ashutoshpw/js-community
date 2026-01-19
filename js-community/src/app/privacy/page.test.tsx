import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import PrivacyPolicy from "./page";

describe("Privacy Policy Page", () => {
  it("should render the main heading", () => {
    render(<PrivacyPolicy />);
    const heading = screen.getByRole("heading", {
      name: /privacy policy/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should display version and effective date", () => {
    render(<PrivacyPolicy />);
    const versionText = screen.getByText(
      /version 1\.0\.0 \| effective date: january 1, 2026/i,
    );
    expect(versionText).toBeInTheDocument();
  });

  it("should render GDPR compliance section", () => {
    render(<PrivacyPolicy />);
    const gdprHeading = screen.getByRole("heading", {
      name: /7\.1 gdpr rights \(eea users\)/i,
    });
    expect(gdprHeading).toBeInTheDocument();
    expect(screen.getByText(/right to access/i)).toBeInTheDocument();
    expect(screen.getByText(/right to erasure/i)).toBeInTheDocument();
    expect(screen.getByText(/right to data portability/i)).toBeInTheDocument();
  });

  it("should render CCPA compliance section", () => {
    render(<PrivacyPolicy />);
    const ccpaHeading = screen.getByRole("heading", {
      name: /7\.2 ccpa rights \(california residents\)/i,
    });
    expect(ccpaHeading).toBeInTheDocument();
    expect(screen.getByText(/right to know/i)).toBeInTheDocument();
    expect(screen.getByText(/right to delete/i)).toBeInTheDocument();
  });

  it("should render cookie policy section", () => {
    render(<PrivacyPolicy />);
    const cookieHeading = screen.getByRole("heading", {
      name: /5\. cookie policy/i,
    });
    expect(cookieHeading).toBeInTheDocument();
    expect(
      screen.getByText(/5\.1 types of cookies we use/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/5\.2 cookie management/i)).toBeInTheDocument();
  });

  it("should render data collection practices", () => {
    render(<PrivacyPolicy />);
    const dataCollectionHeading = screen.getByRole("heading", {
      name: /2\. information we collect/i,
    });
    expect(dataCollectionHeading).toBeInTheDocument();
    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    expect(screen.getByText(/usage data/i)).toBeInTheDocument();
  });

  it("should render data usage section", () => {
    render(<PrivacyPolicy />);
    const dataUsageHeading = screen.getByRole("heading", {
      name: /3\. how we use your information/i,
    });
    expect(dataUsageHeading).toBeInTheDocument();
  });

  it("should render data storage and security section", () => {
    render(<PrivacyPolicy />);
    const storageHeading = screen.getByRole("heading", {
      name: /4\. data storage and security/i,
    });
    expect(storageHeading).toBeInTheDocument();
    expect(screen.getByText(/4\.2 security measures/i)).toBeInTheDocument();
  });

  it("should render user rights section", () => {
    render(<PrivacyPolicy />);
    const rightsHeading = screen.getByRole("heading", {
      name: /7\. your privacy rights/i,
    });
    expect(rightsHeading).toBeInTheDocument();
  });

  it("should render third-party services disclosure", () => {
    render(<PrivacyPolicy />);
    const thirdPartyHeading = screen.getByRole("heading", {
      name: /9\. third-party services/i,
    });
    expect(thirdPartyHeading).toBeInTheDocument();
  });

  it("should render data retention policies", () => {
    render(<PrivacyPolicy />);
    const retentionHeading = screen.getByRole("heading", {
      name: /8\. data retention/i,
    });
    expect(retentionHeading).toBeInTheDocument();
    expect(screen.getByText(/active accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/deleted accounts/i)).toBeInTheDocument();
  });

  it("should render contact information for privacy questions", () => {
    render(<PrivacyPolicy />);
    const contactHeading = screen.getByRole("heading", {
      name: /12\. contact information/i,
    });
    expect(contactHeading).toBeInTheDocument();
    expect(
      screen.getByText(/email: privacy@jscommunity\.example\.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dpo@jscommunity\.example\.com/i),
    ).toBeInTheDocument();
  });

  it("should have version history section", () => {
    render(<PrivacyPolicy />);
    const versionHistoryHeading = screen.getByRole("heading", {
      name: /version history/i,
    });
    expect(versionHistoryHeading).toBeInTheDocument();
    expect(
      screen.getByText(/initial version of privacy policy/i),
    ).toBeInTheDocument();
  });

  it("should mention children's privacy", () => {
    render(<PrivacyPolicy />);
    const childrenHeading = screen.getByRole("heading", {
      name: /10\. children's privacy/i,
    });
    expect(childrenHeading).toBeInTheDocument();
    expect(
      screen.getByText(/not intended for children under the age of 13/i),
    ).toBeInTheDocument();
  });
});
