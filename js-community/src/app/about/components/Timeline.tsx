"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    date: "January 2024",
    title: "The Beginning",
    description:
      "JS Community was born from a simple idea: create a space where JavaScript developers could learn without judgment and share without barriers.",
  },
  {
    date: "March 2024",
    title: "First 1,000 Members",
    description:
      "Our community quickly grew as word spread about our welcoming environment and high-quality discussions.",
  },
  {
    date: "June 2024",
    title: "Launch of Mentorship Program",
    description:
      "Introduced structured mentorship to help junior developers connect with experienced professionals.",
  },
  {
    date: "September 2024",
    title: "Community Guidelines 2.0",
    description:
      "Refined our community guidelines based on member feedback, ensuring inclusivity and respect for all.",
  },
  {
    date: "December 2024",
    title: "Year in Review",
    description:
      "Celebrated our first year with 25,000 members, 50,000 topics, and countless success stories.",
  },
  {
    date: "January 2026",
    title: "Platform Modernization",
    description:
      "Launched our new Next.js-based platform with improved performance, accessibility, and user experience.",
  },
];

export default function Timeline() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Our Journey
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          A timeline of our growth and achievements
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-zinc-200 dark:bg-zinc-800 md:left-1/2" />

        <div className="space-y-12">
          {timeline.map((event, index) => (
            <motion.div
              key={event.date}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex gap-6 md:gap-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-8 flex h-4 w-4 items-center justify-center md:left-1/2 ${
                  index % 2 === 0 ? "md:-ml-2" : "md:-ml-2"
                }`}
              >
                <div className="h-4 w-4 rounded-full border-4 border-white bg-blue-600 dark:border-zinc-950" />
              </div>

              {/* Content */}
              <div
                className={`ml-16 w-full md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? "md:text-right" : "md:text-left"
                }`}
              >
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {event.date}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {event.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden w-5/12 md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
