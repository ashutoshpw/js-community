import { isEmailDeliveryConfigured } from "@/lib/alpha-features";
import { buildAppUrl } from "@/lib/site-url";

type PasswordResetEmailInput = {
  email: string;
  token: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendPasswordResetEmail({
  email,
  token,
}: PasswordResetEmailInput): Promise<void> {
  const resetUrl = await buildAppUrl(
    `/reset-password?token=${encodeURIComponent(token)}`,
  );

  if (!isEmailDeliveryConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Password reset email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM.",
      );
    }

    console.warn(
      `Password reset email delivery is not configured. Reset link for ${email}: ${resetUrl}`,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset your JS Community password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h1 style="font-size: 20px; margin-bottom: 16px;">Reset your password</h1>
          <p>We received a request to reset the password for your JS Community account.</p>
          <p>
            <a href="${escapeHtml(resetUrl)}" style="display: inline-block; padding: 12px 18px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Reset password
            </a>
          </p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
      text: [
        "Reset your JS Community password",
        "",
        "We received a request to reset the password for your JS Community account.",
        `Reset password: ${resetUrl}`,
        "",
        "If you did not request a password reset, you can safely ignore this email.",
        "This link expires in 1 hour.",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to send password reset email: ${details}`);
  }
}
