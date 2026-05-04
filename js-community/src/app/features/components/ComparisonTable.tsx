"use client";

import { motion } from "framer-motion";

const rows = [
  {
    feature: "Threaded discussions",
    us: true,
    github: "Limited",
    reddit: true,
  },
  {
    feature: "Full Markdown + code blocks",
    us: true,
    github: true,
    reddit: "Basic",
  },
  {
    feature: "PostgreSQL full-text search",
    us: true,
    github: "Basic",
    reddit: false,
  },
  {
    feature: "Trust level / permission system",
    us: true,
    github: false,
    reddit: "Karma only",
  },
  {
    feature: "Private messaging",
    us: true,
    github: false,
    reddit: true,
  },
  {
    feature: "Real-time updates (SSE)",
    us: true,
    github: false,
    reddit: true,
  },
  {
    feature: "Moderation review queue",
    us: true,
    github: false,
    reddit: true,
  },
  {
    feature: "Admin dashboard & analytics",
    us: true,
    github: "Limited",
    reddit: false,
  },
  {
    feature: "Bookmarks",
    us: true,
    github: true,
    reddit: true,
  },
  {
    feature: "File / image uploads",
    us: true,
    github: true,
    reddit: true,
  },
  {
    feature: "Open-source & self-hostable",
    us: true,
    github: false,
    reddit: false,
  },
  {
    feature: "Background jobs (Inngest)",
    us: true,
    github: false,
    reddit: false,
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <span className="text-green-600 dark:text-green-400">✓</span>;
  if (value === false)
    return <span className="text-zinc-300 dark:text-zinc-600">—</span>;
  return (
    <span className="text-xs text-zinc-500 dark:text-zinc-400">{value}</span>
  );
}

export function ComparisonTable() {
  return (
    <section className="border-t border-zinc-100 py-16 dark:border-zinc-800 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How we compare
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            JS Community vs GitHub Discussions vs Reddit-style forums
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Feature
                </th>
                <th className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-50">
                  JS Community
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  GitHub Discussions
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  Reddit-style
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-zinc-100 dark:border-zinc-800 ${i % 2 === 0 ? "bg-white dark:bg-zinc-950" : "bg-zinc-50/50 dark:bg-zinc-900/50"}`}
                >
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell value={row.us} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell value={row.github} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell value={row.reddit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
