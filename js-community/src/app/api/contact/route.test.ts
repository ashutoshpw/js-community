/**
 * Tests for contact API route
 */

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "./route";

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  category: "support",
  subject: "I need help with my account",
  message: "Could you please help me reset my account settings?",
  website: "",
};

describe("POST /api/contact", () => {
  it("should return 200 for a valid submission", async () => {
    const response = await POST(createRequest(validBody));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("should return 400 for invalid JSON body", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 when name is missing", async () => {
    const response = await POST(createRequest({ ...validBody, name: "" }));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/name is required/i);
  });

  it("should return 400 when email is invalid", async () => {
    const response = await POST(
      createRequest({ ...validBody, email: "not-an-email" }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/valid email/i);
  });

  it("should return 400 when category is invalid", async () => {
    const response = await POST(
      createRequest({ ...validBody, category: "unknown" }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/valid category/i);
  });

  it("should return 400 when subject is too short", async () => {
    const response = await POST(createRequest({ ...validBody, subject: "Hi" }));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/subject must be at least 5/i);
  });

  it("should return 400 when subject is too long", async () => {
    const response = await POST(
      createRequest({ ...validBody, subject: "x".repeat(121) }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/subject must be at most 120/i);
  });

  it("should return 400 when message is too short", async () => {
    const response = await POST(
      createRequest({ ...validBody, message: "Too short" }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/message must be at least 20/i);
  });

  it("should return 400 when message is too long", async () => {
    const response = await POST(
      createRequest({ ...validBody, message: "x".repeat(5001) }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/message must be at most 5000/i);
  });

  it("should return 200 (fake success) when honeypot field is filled", async () => {
    const response = await POST(
      createRequest({ ...validBody, website: "http://spam.example.com" }),
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("should accept all valid categories", async () => {
    for (const category of ["support", "sales", "feedback"]) {
      const response = await POST(createRequest({ ...validBody, category }));
      expect(response.status).toBe(200);
    }
  });
});
