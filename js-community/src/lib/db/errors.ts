/**
 * Database error handling utilities
 */

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class QueryError extends DatabaseError {
  constructor(
    message: string,
    public query?: string,
    public params?: unknown[],
    cause?: unknown,
  ) {
    super(message, "QUERY_ERROR", cause);
    this.name = "QueryError";
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, "CONNECTION_ERROR", cause);
    this.name = "ConnectionError";
  }
}

export class TransactionError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, "TRANSACTION_ERROR", cause);
    this.name = "TransactionError";
  }
}

export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    public field?: string,
    cause?: unknown,
  ) {
    super(message, "VALIDATION_ERROR", cause);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DatabaseError {
  constructor(
    message: string,
    public resource?: string,
    cause?: unknown,
  ) {
    super(message, "NOT_FOUND", cause);
    this.name = "NotFoundError";
  }
}

export class DuplicateError extends DatabaseError {
  constructor(
    message: string,
    public field?: string,
    cause?: unknown,
  ) {
    super(message, "DUPLICATE_ERROR", cause);
    this.name = "DuplicateError";
  }
}

/**
 * Handle database errors and convert to appropriate error types
 */
export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle specific database error codes (example for PostgreSQL)
    const pgError = error as { code?: string; constraint?: string };

    switch (pgError.code) {
      case "23505": // Unique violation
        return new DuplicateError("Duplicate entry", pgError.constraint, error);
      case "23503": // Foreign key violation
        return new ValidationError(
          "Foreign key constraint failed",
          undefined,
          error,
        );
      case "23502": // Not null violation
        return new ValidationError(
          "Required field is missing",
          undefined,
          error,
        );
      case "42P01": // Undefined table
        return new QueryError(
          "Table does not exist",
          undefined,
          undefined,
          error,
        );
      case "42703": // Undefined column
        return new QueryError(
          "Column does not exist",
          undefined,
          undefined,
          error,
        );
      case "ECONNREFUSED":
      case "ENOTFOUND":
        return new ConnectionError("Database connection failed", error);
      default:
        return new DatabaseError(error.message, pgError.code, error);
    }
  }

  return new DatabaseError("Unknown database error", undefined, error);
}

/**
 * Safely execute a database operation with error handling
 */
export async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

/**
 * Retry a database operation with exponential backoff
 */
export async function retryQuery<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 100,
    maxDelay = 5000,
    backoffMultiplier = 2,
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on validation or not found errors
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof DuplicateError
      ) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }
  }

  throw handleDatabaseError(lastError);
}
