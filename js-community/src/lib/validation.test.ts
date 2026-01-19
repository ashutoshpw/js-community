/**
 * Tests for validation utilities
 */

import { describe, expect, it } from "vitest";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "./validation";

describe("validateUsername", () => {
  it("should accept valid usernames", () => {
    expect(validateUsername("john_doe").valid).toBe(true);
    expect(validateUsername("user123").valid).toBe(true);
    expect(validateUsername("abc").valid).toBe(true);
    expect(validateUsername("test-user").valid).toBe(true);
    expect(validateUsername("user_123").valid).toBe(true);
  });

  it("should reject empty username", () => {
    const result = validateUsername("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Username is required");
  });

  it("should reject username shorter than 3 characters", () => {
    const result = validateUsername("ab");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Username must be at least 3 characters");
  });

  it("should reject username longer than 20 characters", () => {
    const result = validateUsername("a".repeat(21));
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Username must be at most 20 characters");
  });

  it("should reject username not starting with letter or number", () => {
    const result = validateUsername("_username");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Username must start with a letter or number");
  });

  it("should reject username ending with hyphen or underscore", () => {
    const result1 = validateUsername("username-");
    expect(result1.valid).toBe(false);
    expect(result1.error).toBe("Username cannot end with hyphen or underscore");

    const result2 = validateUsername("username_");
    expect(result2.valid).toBe(false);
    expect(result2.error).toBe("Username cannot end with hyphen or underscore");
  });

  it("should reject username with invalid characters", () => {
    const result = validateUsername("user@name");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("can only contain");
  });
});

describe("validateEmail", () => {
  it("should accept valid email addresses", () => {
    expect(validateEmail("user@example.com").valid).toBe(true);
    expect(validateEmail("test.user@domain.co.uk").valid).toBe(true);
    expect(validateEmail("user+tag@example.com").valid).toBe(true);
  });

  it("should reject empty email", () => {
    const result = validateEmail("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("should reject invalid email formats", () => {
    expect(validateEmail("invalid").valid).toBe(false);
    expect(validateEmail("@example.com").valid).toBe(false);
    expect(validateEmail("user@").valid).toBe(false);
    expect(validateEmail("user @example.com").valid).toBe(false);
  });
});

describe("validatePassword", () => {
  it("should accept strong passwords", () => {
    const result = validatePassword("Passw0rd!");
    expect(result.valid).toBe(true);
    expect(result.strength).toBe("strong");
  });

  it("should reject empty password", () => {
    const result = validatePassword("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password is required");
  });

  it("should reject password shorter than 8 characters", () => {
    const result = validatePassword("Pass1!");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at least 8 characters");
  });

  it("should reject password longer than 128 characters", () => {
    const result = validatePassword(`A1!${"a".repeat(126)}`);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at most 128 characters");
  });

  it("should reject password without uppercase letter", () => {
    const result = validatePassword("password123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("at least 3 of");
  });

  it("should reject password without lowercase letter", () => {
    const result = validatePassword("PASSWORD123");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("at least 3 of");
  });

  it("should reject password without number", () => {
    const result = validatePassword("Password");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("at least 3 of");
  });

  it("should calculate password strength correctly", () => {
    expect(validatePassword("Password123!").strength).toBe("strong");
    expect(validatePassword("Password123").strength).toBe("medium");
  });
});

describe("validateName", () => {
  it("should accept valid names", () => {
    expect(validateName("John Doe").valid).toBe(true);
    expect(validateName("Jane").valid).toBe(true);
  });

  it("should reject empty name", () => {
    const result = validateName("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name is required");
  });

  it("should reject name shorter than 2 characters", () => {
    const result = validateName("J");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name must be at least 2 characters");
  });

  it("should reject name longer than 255 characters", () => {
    const result = validateName("a".repeat(256));
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Name must be at most 255 characters");
  });
});
