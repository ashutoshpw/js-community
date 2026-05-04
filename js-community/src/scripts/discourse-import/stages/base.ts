/**
 * Discourse Import — Stage runner base utilities
 *
 * Provides chunked batching, structured JSON-lines logging, and metric tracking.
 */

import type { StageProgress } from "../state";

export interface StageLogger {
  info(msg: string, data?: Record<string, unknown>): void;
  warn(msg: string, data?: Record<string, unknown>): void;
  error(msg: string, data?: Record<string, unknown>): void;
}

export function makeLogger(stage: string): StageLogger {
  const emit = (level: string, msg: string, data?: Record<string, unknown>) => {
    process.stdout.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        level,
        stage,
        msg,
        ...data,
      }) + "\n",
    );
  };
  return {
    info: (msg, data) => emit("info", msg, data),
    warn: (msg, data) => emit("warn", msg, data),
    error: (msg, data) => emit("error", msg, data),
  };
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function emptyProgress(): StageProgress {
  return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
}

export function printSummary(stage: string, p: StageProgress): void {
  process.stdout.write(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "summary",
      stage,
      ...p,
    }) + "\n",
  );
}
