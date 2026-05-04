/**
 * Inngest function: send-email
 *
 * Durable, retryable email delivery function.
 * Instead of calling Resend (or any email provider) inline inside API routes,
 * callers fire an "app/email.send" event and this function handles the delivery
 * with automatic retries on transient failures.
 *
 * Supported email types:
 *   - password-reset  : sends the password reset link to the user
 *   - contact-form    : forwards a contact form submission to the right department
 */

import { inngest } from "@/lib/inngest";
import { sendPasswordResetEmail, sendContactFormEmail } from "@/lib/email";

export type SendEmailEventData =
  | {
      type: "password-reset";
      email: string;
      token: string;
    }
  | {
      type: "contact-form";
      name: string;
      email: string;
      category: "support" | "sales" | "feedback";
      subject: string;
      message: string;
    };

export const sendEmail = inngest.createFunction(
  {
    id: "send-email",
    name: "Send Email",
    retries: 3,
    triggers: [{ event: "app/email.send" }],
  },
  async ({ event, logger }) => {
    const data = event.data as SendEmailEventData;

    if (data.type === "password-reset") {
      await sendPasswordResetEmail({ email: data.email, token: data.token });
      logger.info(`Password reset email sent to ${data.email}`);
      return { sent: true, type: "password-reset", to: data.email };
    }

    if (data.type === "contact-form") {
      await sendContactFormEmail({
        name: data.name,
        email: data.email,
        category: data.category,
        subject: data.subject,
        message: data.message,
      });
      logger.info(`Contact form email forwarded from ${data.email}`);
      return { sent: true, type: "contact-form", from: data.email };
    }

    throw new Error(`Unknown email type: ${(data as { type: string }).type}`);
  },
);
