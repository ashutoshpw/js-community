/**
 * Tests for authentication schema definitions
 */

import { describe, expect, it } from "vitest";
import {
  type Account,
  accounts,
  type NewAccount,
  type NewPasswordResetToken,
  type NewSession,
  type NewVerificationToken,
  type PasswordResetToken,
  passwordResetTokens,
  type Session,
  sessions,
  type VerificationToken,
  verificationTokens,
} from "./auth";

describe("Auth Schema", () => {
  describe("sessions table", () => {
    it("should have correct table name", () => {
      expect(sessions).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(sessions[Symbol.for("drizzle:Name")]).toBe("sessions");
    });

    it("should have required fields", () => {
      const columns = Object.keys(sessions);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("expiresAt");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have optional tracking fields", () => {
      const columns = Object.keys(sessions);
      expect(columns).toContain("ipAddress");
      expect(columns).toContain("userAgent");
    });
  });

  describe("accounts table", () => {
    it("should have correct table name", () => {
      expect(accounts).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(accounts[Symbol.for("drizzle:Name")]).toBe("accounts");
    });

    it("should have required fields", () => {
      const columns = Object.keys(accounts);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("accountId");
      expect(columns).toContain("providerId");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("should have OAuth token fields", () => {
      const columns = Object.keys(accounts);
      expect(columns).toContain("accessToken");
      expect(columns).toContain("refreshToken");
      expect(columns).toContain("idToken");
      expect(columns).toContain("expiresAt");
      expect(columns).toContain("scope");
    });

    it("should have password field for email/password auth", () => {
      const columns = Object.keys(accounts);
      expect(columns).toContain("password");
    });
  });

  describe("verificationTokens table", () => {
    it("should have correct table name", () => {
      expect(verificationTokens).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(verificationTokens[Symbol.for("drizzle:Name")]).toBe(
        "verification_tokens",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(verificationTokens);
      expect(columns).toContain("id");
      expect(columns).toContain("identifier");
      expect(columns).toContain("token");
      expect(columns).toContain("expiresAt");
      expect(columns).toContain("createdAt");
    });
  });

  describe("passwordResetTokens table", () => {
    it("should have correct table name", () => {
      expect(passwordResetTokens).toBeDefined();
      // @ts-expect-error - accessing internal property for testing
      expect(passwordResetTokens[Symbol.for("drizzle:Name")]).toBe(
        "password_reset_tokens",
      );
    });

    it("should have required fields", () => {
      const columns = Object.keys(passwordResetTokens);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("token");
      expect(columns).toContain("expiresAt");
      expect(columns).toContain("used");
      expect(columns).toContain("createdAt");
    });
  });

  describe("TypeScript types", () => {
    it("should define Session type", () => {
      const session: Session = {
        id: "session_123",
        userId: 1,
        expiresAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(session).toBeDefined();
    });

    it("should define NewSession type", () => {
      const newSession: NewSession = {
        id: "session_123",
        userId: 1,
        expiresAt: new Date(),
      };
      expect(newSession).toBeDefined();
    });

    it("should define Account type", () => {
      const account: Account = {
        id: "account_123",
        userId: 1,
        accountId: "oauth_user_123",
        providerId: "google",
        accessToken: "access_token",
        refreshToken: "refresh_token",
        idToken: "id_token",
        expiresAt: new Date(),
        scope: "openid profile email",
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(account).toBeDefined();
    });

    it("should define NewAccount type", () => {
      const newAccount: NewAccount = {
        id: "account_123",
        userId: 1,
        accountId: "oauth_user_123",
        providerId: "google",
      };
      expect(newAccount).toBeDefined();
    });

    it("should define VerificationToken type", () => {
      const token: VerificationToken = {
        id: "token_123",
        identifier: "user@example.com",
        token: "verification_token",
        expiresAt: new Date(),
        createdAt: new Date(),
      };
      expect(token).toBeDefined();
    });

    it("should define NewVerificationToken type", () => {
      const newToken: NewVerificationToken = {
        id: "token_123",
        identifier: "user@example.com",
        token: "verification_token",
        expiresAt: new Date(),
      };
      expect(newToken).toBeDefined();
    });

    it("should define PasswordResetToken type", () => {
      const resetToken: PasswordResetToken = {
        id: "reset_123",
        userId: 1,
        token: "reset_token",
        expiresAt: new Date(),
        used: false,
        createdAt: new Date(),
      };
      expect(resetToken).toBeDefined();
    });

    it("should define NewPasswordResetToken type", () => {
      const newResetToken: NewPasswordResetToken = {
        id: "reset_123",
        userId: 1,
        token: "reset_token",
        expiresAt: new Date(),
      };
      expect(newResetToken).toBeDefined();
    });
  });
});
