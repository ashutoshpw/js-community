/**
 * Structured logging utility
 *
 * Provides consistent logging with levels, timestamps, and structured data.
 * In production, logs can be configured to output JSON for log aggregation.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

type LogData = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: LogData;
}

/**
 * Logger interface type
 */
export interface Logger {
  debug(message: string, data?: LogData): void;
  info(message: string, data?: LogData): void;
  warn(message: string, data?: LogData): void;
  error(message: string, data?: LogData): void;
  exception(message: string, error: unknown, data?: LogData): void;
  child(defaultData: LogData): Logger;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Get the minimum log level from environment or default to "info" in production
 */
function getMinLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel && envLevel in LOG_LEVELS) {
    return envLevel as LogLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

/**
 * Check if JSON logging is enabled (useful for log aggregation services)
 */
function isJsonLogging(): boolean {
  return process.env.LOG_FORMAT === "json";
}

/**
 * Format a log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
  if (isJsonLogging()) {
    return JSON.stringify(entry);
  }

  const levelBadge = `[${entry.level.toUpperCase()}]`;
  const timestamp = entry.timestamp;
  let output = `${timestamp} ${levelBadge} ${entry.message}`;

  if (entry.data && Object.keys(entry.data).length > 0) {
    output += ` ${JSON.stringify(entry.data)}`;
  }

  return output;
}

/**
 * Create a log entry and output it
 */
function log(level: LogLevel, message: string, data?: LogData): void {
  const minLevel = getMinLogLevel();

  // Skip if below minimum log level
  if (LOG_LEVELS[level] < LOG_LEVELS[minLevel]) {
    return;
  }

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
  };

  const output = formatLogEntry(entry);

  switch (level) {
    case "debug":
    case "info":
      console.log(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "error":
      console.error(output);
      break;
  }
}

/**
 * Log an error with stack trace extraction
 */
function logException(
  message: string,
  error: unknown,
  data?: LogData,
  defaultData?: LogData,
): void {
  const errorData: LogData = { ...defaultData, ...data };

  if (error instanceof Error) {
    errorData.errorName = error.name;
    errorData.errorMessage = error.message;
    if (error.stack) {
      errorData.stack = error.stack;
    }
  } else {
    errorData.error = String(error);
  }

  log("error", message, errorData);
}

/**
 * Create a child logger with preset data fields
 */
function createChildLogger(defaultData: LogData): Logger {
  return {
    debug: (msg: string, data?: LogData) =>
      log("debug", msg, { ...defaultData, ...data }),
    info: (msg: string, data?: LogData) =>
      log("info", msg, { ...defaultData, ...data }),
    warn: (msg: string, data?: LogData) =>
      log("warn", msg, { ...defaultData, ...data }),
    error: (msg: string, data?: LogData) =>
      log("error", msg, { ...defaultData, ...data }),
    exception: (msg: string, error: unknown, data?: LogData) =>
      logException(msg, error, data, defaultData),
    child: (childData: LogData) =>
      createChildLogger({ ...defaultData, ...childData }),
  };
}

/**
 * Logger instance for structured logging
 */
export const logger: Logger = {
  /**
   * Debug level - verbose logging for development
   */
  debug(message: string, data?: LogData): void {
    log("debug", message, data);
  },

  /**
   * Info level - general operational messages
   */
  info(message: string, data?: LogData): void {
    log("info", message, data);
  },

  /**
   * Warn level - potentially problematic situations
   */
  warn(message: string, data?: LogData): void {
    log("warn", message, data);
  },

  /**
   * Error level - error conditions
   */
  error(message: string, data?: LogData): void {
    log("error", message, data);
  },

  /**
   * Log an error with stack trace
   */
  exception(message: string, error: unknown, data?: LogData): void {
    logException(message, error, data);
  },

  /**
   * Create a child logger with preset data fields
   */
  child(defaultData: LogData): Logger {
    return createChildLogger(defaultData);
  },
};
