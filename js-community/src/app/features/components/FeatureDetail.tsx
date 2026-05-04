"use client";

import { motion } from "framer-motion";

interface FeatureDetailProps {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  reversed?: boolean;
  index: number;
}

export function FeatureDetail({
  icon,
  title,
  description,
  bullets,
  reversed = false,
  index,
}: FeatureDetailProps) {
  return (
    <section className="border-t border-zinc-100 py-16 dark:border-zinc-800 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className={`flex flex-col gap-12 lg:flex-row lg:items-center ${reversed ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Illustration / icon panel */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: reversed ? 32 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex h-56 items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-7xl" aria-hidden="true">
                {icon}
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: reversed ? -32 : 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Feature {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
            <ul className="mt-6 space-y-2">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <span className="mt-0.5 text-zinc-400 dark:text-zinc-600" aria-hidden="true">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
