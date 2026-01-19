import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

describe("PasswordStrengthIndicator", () => {
  it("should show weak password for simple passwords", () => {
    render(<PasswordStrengthIndicator password="simple" />);
    expect(screen.getByText(/weak password/i)).toBeInTheDocument();
  });

  it("should show medium password for moderately complex passwords", () => {
    render(<PasswordStrengthIndicator password="Simple123" />);
    expect(screen.getByText(/medium strength/i)).toBeInTheDocument();
  });

  it("should show strong password for complex passwords", () => {
    render(<PasswordStrengthIndicator password="Simple123!@#" />);
    expect(screen.getByText(/strong password/i)).toBeInTheDocument();
  });

  it("should display validation error for short passwords", () => {
    render(<PasswordStrengthIndicator password="Abc1!" />);
    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
  });

  it("should display validation error for passwords without enough character types", () => {
    render(<PasswordStrengthIndicator password="password" />);
    expect(
      screen.getByText(/password must contain at least 3 of/i),
    ).toBeInTheDocument();
  });

  it("should render progress bar for weak password", () => {
    const { container } = render(<PasswordStrengthIndicator password="weak" />);
    const progressBar = container.querySelector(".bg-red-500");
    expect(progressBar).toBeInTheDocument();
  });

  it("should render progress bar for medium password", () => {
    const { container } = render(
      <PasswordStrengthIndicator password="Simple123" />,
    );
    const progressBar = container.querySelector(".bg-yellow-500");
    expect(progressBar).toBeInTheDocument();
  });

  it("should render progress bar for strong password", () => {
    const { container } = render(
      <PasswordStrengthIndicator password="Strong1!@#" />,
    );
    const progressBar = container.querySelector(".bg-green-500");
    expect(progressBar).toBeInTheDocument();
  });

  it("should not display error for valid strong password", () => {
    render(<PasswordStrengthIndicator password="ValidPass123!" />);
    expect(screen.getByText(/strong password/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/password must be at least 8 characters/i),
    ).not.toBeInTheDocument();
  });

  it("should handle empty password gracefully", () => {
    render(<PasswordStrengthIndicator password="" />);
    expect(screen.getByText(/weak password/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
