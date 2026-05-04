import type { Metadata } from "next";
import { FAQClient } from "./components/FAQClient";

export const metadata: Metadata = {
  title: "FAQ | JS Community",
  description:
    "Answers to frequently asked questions about JS Community — getting started, features, account management, moderation, and technical details.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "help",
    "JavaScript community",
    "forum",
    "support",
  ],
  openGraph: {
    title: "FAQ | JS Community",
    description:
      "Answers to frequently asked questions about JS Community — getting started, features, account management, moderation, and technical details.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | JS Community",
    description:
      "Answers to frequently asked questions about JS Community — getting started, features, account management, moderation, and technical details.",
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Quick answers across five categories. Use the search box to jump
            straight to what you need.
          </p>
        </div>

        <FAQClient />
      </div>
    </div>
  );
}
