"use client";

import { motion } from "framer-motion";

const departments = [
  {
    title: "General Support",
    email: "support@jscommunity.example.com",
    description: "Account issues, technical problems, and general help",
    icon: "🛟",
    responseTime: "Within 24 hours",
  },
  {
    title: "Sales & Billing",
    email: "sales@jscommunity.example.com",
    description: "Pricing questions, subscription management, and invoices",
    icon: "💳",
    responseTime: "Within 12 hours",
  },
  {
    title: "Feedback",
    email: "feedback@jscommunity.example.com",
    description: "Feature requests, bug reports, and product suggestions",
    icon: "💡",
    responseTime: "Within 48 hours",
  },
  {
    title: "Partnerships",
    email: "partners@jscommunity.example.com",
    description: "Collaboration opportunities and sponsorships",
    icon: "🤝",
    responseTime: "Within 3 business days",
  },
];

export default function ContactInfo() {
  return (
    <section className="mt-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Contact by Department
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Reach the right team directly for a faster response
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 text-3xl">{dept.icon}</div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
              {dept.title}
            </h3>
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              {dept.description}
            </p>
            <a
              href={`mailto:${dept.email}`}
              className="block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {dept.email}
            </a>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              ⏱ {dept.responseTime}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
