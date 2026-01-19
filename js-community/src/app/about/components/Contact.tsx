"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const contactMethods = [
  {
    title: "General Inquiries",
    email: "hello@jscommunity.example.com",
    description: "For general questions and information about JS Community",
    icon: "📧",
  },
  {
    title: "Support",
    email: "support@jscommunity.example.com",
    description: "Need help? Our support team is here for you",
    icon: "🛟",
  },
  {
    title: "Partnerships",
    email: "partners@jscommunity.example.com",
    description: "Interested in collaborating? Let's talk",
    icon: "🤝",
  },
  {
    title: "Press & Media",
    email: "press@jscommunity.example.com",
    description: "Media inquiries and press releases",
    icon: "📰",
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/jscommunity",
    icon: "💻",
    description: "Follow our open source projects",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/jscommunity",
    icon: "𝕏",
    description: "Stay updated with the latest news",
  },
  {
    name: "Discord",
    href: "https://discord.gg/jscommunity",
    icon: "💬",
    description: "Join our Discord server for real-time chat",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/jscommunity",
    icon: "💼",
    description: "Connect with us professionally",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@jscommunity",
    icon: "📺",
    description: "Watch tutorials and community highlights",
  },
  {
    name: "Dev.to",
    href: "https://dev.to/jscommunity",
    icon: "📝",
    description: "Read our blog posts and articles",
  },
];

export default function Contact() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Get in Touch
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          We'd love to hear from you. Reach out through any of these channels
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 text-3xl">{method.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {method.title}
            </h3>
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              {method.description}
            </p>
            <a
              href={`mailto:${method.email}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {method.email}
            </a>
          </motion.div>
        ))}
      </div>

      {/* Social Media Links */}
      <div className="mx-auto max-w-5xl">
        <h3 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Connect With Us
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-6 text-center transition-all hover:scale-105 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-3xl">{social.icon}</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {social.name}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {social.description}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center dark:from-blue-950/20 dark:to-indigo-950/20 sm:p-12"
      >
        <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Ready to Join the Community?
        </h3>
        <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
          Sign up today and start connecting with thousands of JavaScript
          developers
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Get Started
          </Link>
          <Link
            href="/privacy"
            className="rounded-lg border border-zinc-300 bg-white px-8 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Privacy Policy
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
