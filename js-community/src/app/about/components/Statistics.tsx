"use client";

import { motion } from "framer-motion";

const stats = [
  {
    label: "Active Members",
    value: "50,000+",
    description: "Developers from around the world",
    icon: "👥",
  },
  {
    label: "Topics Discussed",
    value: "100,000+",
    description: "Conversations and threads",
    icon: "💬",
  },
  {
    label: "Questions Answered",
    value: "250,000+",
    description: "Solutions shared by the community",
    icon: "✅",
  },
  {
    label: "Countries Represented",
    value: "150+",
    description: "A truly global community",
    icon: "🌍",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Launch of JS Community",
    description:
      "Started with a vision to create an inclusive JavaScript community platform.",
  },
  {
    year: "2025",
    title: "Reached 10,000 Members",
    description:
      "Our community grew rapidly, welcoming developers from all backgrounds.",
  },
  {
    year: "2026",
    title: "50,000+ Active Members",
    description:
      "Became one of the fastest-growing JavaScript communities worldwide.",
  },
];

export default function Statistics() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Our Impact
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          Growing together, one developer at a time
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 text-4xl">{stat.icon}</div>
            <div className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </div>
            <div className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {stat.label}
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              {stat.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Milestones */}
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Key Milestones
        </h3>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
                {milestone.year}
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {milestone.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
