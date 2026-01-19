import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import Home from "./page";

describe("Home Page", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /to get started, edit the page\.tsx file/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render the Next.js logo", () => {
    render(<Home />);
    const logo = screen.getByAltText("Next.js logo");
    expect(logo).toBeInTheDocument();
  });

  it("should render links to Templates and Learning center", () => {
    render(<Home />);
    const templatesLink = screen.getByRole("link", { name: /templates/i });
    const learningLink = screen.getByRole("link", { name: /learning/i });

    expect(templatesLink).toBeInTheDocument();
    expect(learningLink).toBeInTheDocument();
  });

  it("should render Deploy Now button", () => {
    render(<Home />);
    const deployButton = screen.getByRole("link", { name: /deploy now/i });
    expect(deployButton).toBeInTheDocument();
    expect(deployButton).toHaveAttribute("target", "_blank");
  });

  it("should render Documentation link", () => {
    render(<Home />);
    const docLink = screen.getByRole("link", { name: /documentation/i });
    expect(docLink).toBeInTheDocument();
    expect(docLink).toHaveAttribute("target", "_blank");
  });
});
