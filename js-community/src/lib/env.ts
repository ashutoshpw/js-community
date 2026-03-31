/**
 * Environment variable validation
 *
 * This module validates required environment variables at startup to fail fast
 * if critical configuration is missing rather than failing at runtime.
 */

type EnvVarConfig = {
  name: string;
  required: boolean | "production";
  description: string;
};

const ENV_VARS: EnvVarConfig[] = [
  {
    name: "DATABASE_URL",
    required: true,
    description: "PostgreSQL connection string",
  },
  {
    name: "BETTER_AUTH_SECRET",
    required: true,
    description: "Secret for authentication JWT signing",
  },
  {
    name: "RESEND_API_KEY",
    required: "production",
    description: "Resend API key for email delivery",
  },
  {
    name: "EMAIL_FROM",
    required: "production",
    description: "Email sender address (e.g., noreply@example.com)",
  },
];

type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validate environment variables and return a result object
 */
export function validateEnv(): ValidationResult {
  const isProduction = process.env.NODE_ENV === "production";
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const config of ENV_VARS) {
    const value = process.env[config.name];
    const isMissing = !value || value.trim() === "";

    if (config.required === true && isMissing) {
      errors.push(
        `Missing required env var: ${config.name} - ${config.description}`,
      );
    } else if (config.required === "production" && isProduction && isMissing) {
      errors.push(
        `Missing required env var in production: ${config.name} - ${config.description}`,
      );
    } else if (config.required === "production" && !isProduction && isMissing) {
      warnings.push(
        `Missing env var (required in production): ${config.name} - ${config.description}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate environment variables and throw if critical ones are missing.
 * Logs warnings for non-critical missing variables.
 */
export function assertEnv(): void {
  const result = validateEnv();

  // Log warnings
  for (const warning of result.warnings) {
    console.warn(`[env] WARNING: ${warning}`);
  }

  // Throw on errors
  if (!result.valid) {
    const errorMessage = [
      "Environment validation failed:",
      ...result.errors.map((e) => `  - ${e}`),
    ].join("\n");

    throw new Error(errorMessage);
  }
}

/**
 * Get a required environment variable or throw an error.
 * Use this for runtime access to ensure variables are present.
 */
export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Get an optional environment variable with a default value.
 */
export function getEnvOrDefault(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : defaultValue;
}
