"use client";

import { motion } from "framer-motion";

const socialLinks = [
  {
    name: "Twitter / X",
    href: "https://twitter.com/jscommunity",
    icon: "𝕏",
    description: "Follow us for updates",
    handle: "@jscommunity",
  },
  {
    name: "GitHub",
    href: "https://github.com/jscommunity",
    icon: "💻",
    description: "Explore our open source projects",
    handle: "github.com/jscommunity",
  },
  {
    name: "GitHub Discussions",
    href: "https://github.com/jscommunity/discussions",
    icon: "💬",
    description: "Ask questions and share ideas",
    handle: "Discussions",
  },
  {
    name: "Community Forum",
    href: "/forum",
    icon: "🌐",
    description: "Connect with other developers",
    handle: "forum.jscommunity",
  },
  {
    name: "Discord",
    href: "https://discord.gg/jscommunity",
    icon: "🎮",
    description: "Real-time chat and support",
    handle: "discord.gg/jscommunity",
  },
];

export default function SocialLinks() {
  return (
    <section className="mt-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Connect With Us
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Find us across the web for real-time help and community discussion
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel={
              social.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-5 text-center transition-all hover:scale-105 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
          >
            <span className="text-3xl">{social.icon}</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {social.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {social.description}
            </span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
              {social.handle}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
