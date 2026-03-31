/**
 * Contact form API route
 * Validates submitted contact form data and simulates email notification.
 * TODO: Integrate a real email service (e.g., Resend, SendGrid) to deliver
 *       notifications to the appropriate department inbox.
 */

import type { NextRequest } from "next/server";
import { validateEmail, validateName } from "@/lib/validation";

const VALID_CATEGORIES = ["support", "sales", "feedback"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

function isValidCategory(value: unknown): value is Category {
  return VALID_CATEGORIES.includes(value as Category);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, category, subject, message, website } = body;

  // Honeypot spam check — bots typically fill hidden fields
  if (typeof website === "string" && website.trim() !== "") {
    // Return a fake success to avoid revealing the check to bots
    return Response.json({ ok: true }, { status: 200 });
  }

  // Validate name
  const nameResult = validateName(typeof name === "string" ? name : "");
  if (!nameResult.valid) {
    return Response.json({ error: nameResult.error }, { status: 400 });
  }

  // Validate email
  const emailResult = validateEmail(typeof email === "string" ? email : "");
  if (!emailResult.valid) {
    return Response.json({ error: emailResult.error }, { status: 400 });
  }

  // Validate category
  if (!isValidCategory(category)) {
    return Response.json(
      { error: "Please select a valid category" },
      { status: 400 },
    );
  }

  // Validate subject
  if (typeof subject !== "string" || subject.trim().length < 5) {
    return Response.json(
      { error: "Subject must be at least 5 characters" },
      { status: 400 },
    );
  }
  if (subject.trim().length > 120) {
    return Response.json(
      { error: "Subject must be at most 120 characters" },
      { status: 400 },
    );
  }

  // Validate message
  if (typeof message !== "string" || message.trim().length < 20) {
    return Response.json(
      { error: "Message must be at least 20 characters" },
      { status: 400 },
    );
  }
  if (message.trim().length > 5000) {
    return Response.json(
      { error: "Message must be at most 5000 characters" },
      { status: 400 },
    );
  }

  // TODO: Send email notification to the relevant department.
  // Example using Resend:
  //   await resend.emails.send({
  //     from: 'noreply@jscommunity.example.com',
  //     to: DEPARTMENT_EMAILS[category],
  //     subject: `[${category}] ${subject}`,
  //     text: `From: ${name} <${email}>\n\n${message}`,
  //   });

  return Response.json({ ok: true }, { status: 200 });
}
