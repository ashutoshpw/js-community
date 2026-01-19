/**
 * Validation utilities for user input
 */

/**
 * Username validation rules:
 * - 3-20 characters
 * - Alphanumeric, underscores, and hyphens only
 * - Must start with a letter or number
 * - Cannot end with hyphen or underscore
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be at most 20 characters" };
  }

  if (!/^[a-zA-Z0-9]/.test(username)) {
    return {
      valid: false,
      error: "Username must start with a letter or number",
    };
  }

  if (/[-_]$/.test(username)) {
    return {
      valid: false,
      error: "Username cannot end with hyphen or underscore",
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { valid: true };
}

/**
 * Email validation using standard email regex pattern
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Password validation rules:
 * - 8-128 characters (matching better-auth config)
 * - At least three of the following:
 *   - Uppercase letter
 *   - Lowercase letter
 *   - Number
 *   - Special character
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
  strength?: "weak" | "medium" | "strong";
} {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters",
      strength: "weak",
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      error: "Password must be at most 128 characters",
    };
  }

  let strength: "weak" | "medium" | "strong" = "weak";
  let strengthCount = 0;

  if (/[a-z]/.test(password)) strengthCount++;
  if (/[A-Z]/.test(password)) strengthCount++;
  if (/[0-9]/.test(password)) strengthCount++;
  if (/[^a-zA-Z0-9]/.test(password)) strengthCount++;

  if (strengthCount >= 4) {
    strength = "strong";
  } else if (strengthCount >= 3) {
    strength = "medium";
  }

  if (strengthCount < 3) {
    return {
      valid: false,
      error:
        "Password must contain at least 3 of: uppercase, lowercase, number, or special character",
      strength,
    };
  }

  return { valid: true, strength };
}

/**
 * Name validation
 */
export function validateName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name) {
    return { valid: false, error: "Name is required" };
  }

  if (name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }

  if (name.length > 255) {
    return { valid: false, error: "Name must be at most 255 characters" };
  }

  return { valid: true };
}
