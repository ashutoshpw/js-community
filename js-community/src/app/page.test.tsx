import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import Home from "./page";

describe("Home Page", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /connect, learn, and grow with the javascript community/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render primary call-to-action links", () => {
    render(<Home />);
    const getStartedLink = screen.getByRole("link", {
      name: /get started free/i,
    });
    const signInLink = screen.getByRole("link", {
      name: /sign in/i,
    });

    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute("href", "/register");
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("should render the community stats section", () => {
    render(<Home />);
    const statsHeading = screen.getByRole("heading", {
      name: /join a thriving community/i,
    });

    expect(statsHeading).toBeInTheDocument();
  });

  it("should render footer legal navigation", () => {
    render(<Home />);
    const termsLink = screen.getByRole("link", { name: /terms of service/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms");
  });
});
