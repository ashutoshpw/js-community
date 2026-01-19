"use client";

import { motion } from "framer-motion";

const stats = [
  { id: 1, name: "Active Members", value: "15,000+", icon: "👥" },
  { id: 2, name: "Topics Discussed", value: "50,000+", icon: "💡" },
  { id: 3, name: "Questions Answered", value: "100,000+", icon: "✅" },
  { id: 4, name: "Code Snippets Shared", value: "25,000+", icon: "📝" },
];

export default function Stats() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Join a Thriving Community
          </motion.h2>
          <motion.p
            className="mt-4 text-lg leading-8 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Thousands of developers are already learning, sharing, and growing
            together.
          </motion.p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-center sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="flex flex-col gap-y-3 rounded-2xl bg-white/10 p-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl">{stat.icon}</div>
              <dt className="text-sm leading-6 text-blue-100">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
