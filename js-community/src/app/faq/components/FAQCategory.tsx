"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategoryProps {
  title: string;
  icon: string;
  items: FAQItem[];
  searchQuery: string;
}

export function FAQCategory({
  title,
  icon,
  items,
  searchQuery,
}: FAQCategoryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = searchQuery.trim()
    ? items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  if (filtered.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h2>
      <div className="space-y-2">
        {filtered.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-start justify-between px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {item.question}
                </span>
                <span
                  className="ml-4 mt-0.5 flex-shrink-0 text-zinc-500 transition-transform duration-200 dark:text-zinc-400"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-zinc-100 px-5 pb-4 pt-3 dark:border-zinc-800">
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
