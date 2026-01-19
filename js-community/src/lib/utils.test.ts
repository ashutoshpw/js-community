import { describe, expect, it } from "vitest";
import {
  calculateReadingTime,
  formatFullName,
  isValidEmail,
  truncateText,
} from "./utils";

describe("formatFullName", () => {
  it("should combine first and last name", () => {
    expect(formatFullName("John", "Doe")).toBe("John Doe");
  });

  it("should handle empty strings", () => {
    expect(formatFullName("", "")).toBe("");
  });

  it("should trim outer whitespace only", () => {
    expect(formatFullName("John", "Doe")).toBe("John Doe");
    expect(formatFullName(" John ", " Doe ")).toBe("John   Doe");
  });
});

describe("isValidEmail", () => {
  it("should validate correct email addresses", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("test@example")).toBe(false);
  });

  it("should reject emails with spaces", () => {
    expect(isValidEmail("test @example.com")).toBe(false);
  });
});

describe("truncateText", () => {
  it("should truncate text longer than maxLength", () => {
    expect(truncateText("Hello, World!", 5)).toBe("Hello...");
  });

  it("should not truncate text shorter than maxLength", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("should handle exact length", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });
});

describe("calculateReadingTime", () => {
  it("should calculate reading time correctly", () => {
    const text = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("should round up partial minutes", () => {
    const text = Array(250).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("should handle empty text", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("should handle single word", () => {
    expect(calculateReadingTime("word")).toBe(1);
  });
});
