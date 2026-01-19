"use client";

import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="mx-auto mt-16 max-w-4xl sm:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-950/20 dark:to-indigo-950/20 sm:p-12"
      >
        <h2 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Our Mission
        </h2>
        <p className="mb-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          At JS Community, we believe that knowledge grows when shared. Our
          mission is to create an inclusive, supportive environment where
          JavaScript developers of all skill levels can connect, learn, and
          thrive together.
        </p>
        <p className="mb-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          We're building more than just a platform—we're cultivating a vibrant
          ecosystem where curiosity is encouraged, questions are welcomed, and
          every developer has the opportunity to contribute and grow.
        </p>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Through meaningful discussions, knowledge sharing, and collaborative
          problem-solving, we empower our community members to advance their
          careers, build amazing projects, and shape the future of JavaScript
          development.
        </p>
      </motion.div>
    </section>
  );
}
