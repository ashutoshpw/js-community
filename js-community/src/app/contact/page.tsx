import type { Metadata } from "next";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import FAQ from "./components/FAQ";
import SocialLinks from "./components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact & Support | JS Community",
  description:
    "Get in touch with the JS Community team. Find support, submit feedback, and connect with us through multiple channels.",
  keywords: [
    "contact",
    "support",
    "feedback",
    "help",
    "JavaScript community",
    "customer service",
  ],
  openGraph: {
    title: "Contact & Support | JS Community",
    description:
      "Get in touch with the JS Community team. Find support, submit feedback, and connect with us through multiple channels.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Support | JS Community",
    description:
      "Get in touch with the JS Community team. Find support, submit feedback, and connect with us through multiple channels.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Contact & Support
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            We're here to help. Reach out through any channel below and we'll
            get back to you as quickly as possible.
          </p>
        </div>

        {/* Contact by Department */}
        <ContactInfo />

        {/* Social / Community links */}
        <SocialLinks />

        {/* FAQ */}
        <FAQ />

        {/* Contact Form */}
        <section className="mt-16" id="contact-form">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Send Us a Message
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Fill out the form and we'll respond within one business day.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
