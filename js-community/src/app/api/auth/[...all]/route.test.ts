/**
 * Tests for auth API routes
 */

import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    handler: vi.fn(() => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  },
}));

describe("Auth API Routes", () => {
  describe("GET /api/auth/[...all]", () => {
    it("should be defined", () => {
      expect(GET).toBeDefined();
      expect(typeof GET).toBe("function");
    });

    it("should call auth.handler with request", async () => {
      const request = new Request("http://localhost:3000/api/auth/session");
      const response = await GET(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it("should handle OAuth callback requests", async () => {
      const request = new Request(
        "http://localhost:3000/api/auth/callback/google?code=test_code",
      );
      const response = await GET(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it("should handle session retrieval requests", async () => {
      const request = new Request("http://localhost:3000/api/auth/session");
      const response = await GET(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/auth/[...all]", () => {
    it("should be defined", () => {
      expect(POST).toBeDefined();
      expect(typeof POST).toBe("function");
    });

    it("should call auth.handler with request", async () => {
      const request = new Request("http://localhost:3000/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const response = await POST(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it("should handle sign-in requests", async () => {
      const request = new Request("http://localhost:3000/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com",
          password: "securepassword",
        }),
      });
      const response = await POST(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it("should handle sign-up requests", async () => {
      const request = new Request("http://localhost:3000/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "newpassword123",
          name: "New User",
        }),
      });
      const response = await POST(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it("should handle sign-out requests", async () => {
      const request = new Request("http://localhost:3000/api/auth/sign-out", {
        method: "POST",
      });
      const response = await POST(request as NextRequest);

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });
  });

  describe("Error handling", () => {
    it("should handle requests gracefully", async () => {
      const request = new Request("http://localhost:3000/api/auth/unknown");
      const response = await GET(request as NextRequest);

      expect(response).toBeDefined();
    });
  });
});
