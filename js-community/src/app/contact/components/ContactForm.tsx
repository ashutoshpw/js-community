"use client";

import { useState } from "react";
import { validateEmail, validateName } from "@/lib/validation";

const CATEGORIES = [
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales & Billing" },
  { value: "feedback", label: "Feedback & Suggestions" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

interface FormData {
  name: string;
  email: string;
  category: Category | "";
  subject: string;
  message: string;
  /** Honeypot: must remain empty to pass spam check */
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  category?: string;
  subject?: string;
  message?: string;
  general?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const next: FormErrors = {};

    const nameResult = validateName(formData.name);
    if (!nameResult.valid) next.name = nameResult.error;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) next.email = emailResult.error;

    if (!formData.category) next.category = "Please select a category";

    if (!formData.subject.trim()) {
      next.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      next.subject = "Subject must be at least 5 characters";
    } else if (formData.subject.trim().length > 120) {
      next.subject = "Subject must be at most 120 characters";
    }

    if (!formData.message.trim()) {
      next.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      next.message = "Message must be at least 20 characters";
    } else if (formData.message.trim().length > 5000) {
      next.message = "Message must be at most 5000 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ general: data.error || "Failed to send your message." });
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
        website: "",
      });
      setErrors({});
    } catch {
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/30"
      >
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-semibold text-green-800 dark:text-green-300">
          Message Sent!
        </h3>
        <p className="text-green-700 dark:text-green-400">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setSubmitStatus("idle")}
          className="mt-6 rounded-lg border border-green-300 px-6 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/40"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users, traps bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">
          Leave this field empty
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </label>
      </div>

      {errors.general && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-4 dark:bg-red-950/30"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {errors.general}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email Address <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Category <span aria-hidden="true">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 sm:text-sm"
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.category}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Subject <span aria-hidden="true">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief description of your inquiry"
          className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us more about your inquiry…"
          className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 sm:text-sm"
        />
        <p className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
          {formData.message.length} / 5000
        </p>
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitStatus === "loading"}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700"
      >
        {submitStatus === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
