"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "Inclusivity",
    description:
      "We welcome developers from all backgrounds, experience levels, and perspectives. Everyone deserves a seat at the table.",
    icon: "🤝",
  },
  {
    title: "Knowledge Sharing",
    description:
      "We believe in the power of collective intelligence. Share what you know, learn from others, and grow together.",
    icon: "📚",
  },
  {
    title: "Respect & Kindness",
    description:
      "We treat each other with respect, empathy, and understanding. Constructive feedback is always welcome.",
    icon: "💙",
  },
  {
    title: "Innovation",
    description:
      "We encourage experimentation, creativity, and pushing boundaries. Great ideas can come from anywhere.",
    icon: "🚀",
  },
  {
    title: "Transparency",
    description:
      "We operate openly and honestly. Our platform, processes, and decision-making are transparent to the community.",
    icon: "🔍",
  },
  {
    title: "Continuous Learning",
    description:
      "Technology evolves rapidly, and so should we. We embrace lifelong learning and adaptability.",
    icon: "🌱",
  },
];

export default function Values() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Our Values
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          These principles guide everything we do at JS Community
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 text-4xl">{value.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {value.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
