import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import ContactPage from "./page";

describe("Contact Page", () => {
  it("should render the main heading", () => {
    render(<ContactPage />);
    const heading = screen.getByRole("heading", {
      name: /contact & support/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render the contact form section heading", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /send us a message/i }),
    ).toBeInTheDocument();
  });

  it("should render the department contact info section", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /contact by department/i }),
    ).toBeInTheDocument();
  });

  it("should render the social links section", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /connect with us/i }),
    ).toBeInTheDocument();
  });

  it("should render the FAQ section", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
  });

  it("should render the contact form submit button", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });
});
