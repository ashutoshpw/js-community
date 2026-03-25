"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      'You can reset your password by clicking "Forgot your password?" on the login page. We\'ll send a reset link to your registered email address.',
  },
  {
    question: "How long does support take to respond?",
    answer:
      "Our support team typically responds within 24 hours for general inquiries. For urgent issues, please mark your message as high priority. Sales and billing queries are handled within 12 hours.",
  },
  {
    question: "Can I change my username?",
    answer:
      "Usernames can be changed once every 30 days from your profile settings. Navigate to Settings → Profile to update your username.",
  },
  {
    question: "How do I report a bug or inappropriate content?",
    answer:
      'You can report bugs through our GitHub Issues page or by emailing feedback@jscommunity.example.com. To report inappropriate content, use the "Flag" button on any post.',
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "We currently offer a mobile-optimized web experience. A dedicated mobile app is on our roadmap. Follow our Twitter/X account for announcements.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Account deletion requests can be submitted via Settings → Account → Delete Account. Data deletion is permanent and complies with our Privacy Policy.",
  },
  {
    question: "Where can I find the API documentation?",
    answer:
      "Our API documentation is available in the GitHub repository. Check the docs/ folder or visit our GitHub Discussions for community-contributed guides.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Quick answers to common questions
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {faq.question}
              </span>
              <span
                className="ml-4 flex-shrink-0 text-zinc-500 transition-transform dark:text-zinc-400"
                style={{
                  transform: openIndex === index ? "rotate(180deg)" : "none",
                }}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>
            {openIndex === index && (
              <div className="border-t border-zinc-100 px-6 pb-4 pt-3 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Can't find what you're looking for?{" "}
          <Link
            href="https://github.com/jscommunity/discussions"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse our documentation
          </Link>{" "}
          or use the contact form below.
        </p>
      </div>
    </section>
  );
}
