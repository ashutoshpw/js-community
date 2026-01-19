import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("should render the main heading", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { name: /sign in to your account/i }),
    ).toBeInTheDocument();
  });

  it("should render a link to the registration page", () => {
    render(<LoginPage />);
    const registerLink = screen.getByRole("link", {
      name: /create a new account/i,
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("should render the login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("link", { name: /create a new account/i }),
    ).toBeInTheDocument();
  });
});
