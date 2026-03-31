CREATE TABLE IF NOT EXISTS "password_reset_rate_limits" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "identifier" text NOT NULL UNIQUE,
  "attempts" integer DEFAULT 0 NOT NULL,
  "blocked_until" timestamp with time zone,
  "last_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "password_reset_rate_limits_identifier_idx"
  ON "password_reset_rate_limits" ("identifier");

CREATE INDEX IF NOT EXISTS "password_reset_rate_limits_blocked_until_idx"
  ON "password_reset_rate_limits" ("blocked_until");
