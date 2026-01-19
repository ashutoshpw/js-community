"use client";

import { motion } from "framer-motion";

const features = [
  {
    name: "Ask & Answer",
    description:
      "Get help from experienced developers and share your knowledge with others. Every question makes the community stronger.",
    icon: "💬",
  },
  {
    name: "Rich Discussions",
    description:
      "Engage in meaningful conversations about JavaScript, frameworks, best practices, and the latest trends in web development.",
    icon: "🎯",
  },
  {
    name: "Code Sharing",
    description:
      "Share code snippets, review others' work, and collaborate on solutions. Learn by doing and helping others.",
    icon: "💻",
  },
  {
    name: "Weekly Challenges",
    description:
      "Participate in coding challenges, improve your skills, and compete with fellow developers in a friendly environment.",
    icon: "🏆",
  },
  {
    name: "Events & Workshops",
    description:
      "Join virtual meetups, workshops, and webinars hosted by industry experts and community leaders.",
    icon: "📅",
  },
  {
    name: "Resources Library",
    description:
      "Access curated tutorials, articles, and resources vetted by the community to accelerate your learning journey.",
    icon: "📚",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything you need
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A complete platform for developers
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join a thriving community where learning never stops and
            collaboration is the key to success.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <span className="text-4xl">{feature.icon}</span>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
