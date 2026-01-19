"use client";

import { motion } from "framer-motion";

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & Lead Developer",
    bio: "Passionate about building developer communities and creating tools that empower learning. 10+ years in JavaScript ecosystem.",
    avatar: "AR",
    github: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    name: "Sarah Chen",
    role: "Community Manager",
    bio: "Dedicated to fostering inclusive environments where developers thrive. Expert in community engagement and content strategy.",
    avatar: "SC",
    github: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    name: "Marcus Johnson",
    role: "Technical Lead",
    bio: "Full-stack developer with expertise in React, Node.js, and scalable architecture. Loves mentoring junior developers.",
    avatar: "MJ",
    github: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    name: "Priya Sharma",
    role: "Developer Experience",
    bio: "Focused on making our platform intuitive and delightful. Background in UX design and frontend development.",
    avatar: "PS",
    github: "#",
    twitter: "#",
    linkedin: "#",
  },
];

export default function Team() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Meet Our Team
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          The passionate people behind JS Community
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Avatar */}
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
              {member.avatar}
            </div>

            {/* Name and Role */}
            <h3 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {member.name}
            </h3>
            <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">
              {member.role}
            </p>

            {/* Bio */}
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {member.bio}
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-3">
              <a
                href={member.github}
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label={`${member.name} on GitHub`}
              >
                💻
              </a>
              <a
                href={member.twitter}
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label={`${member.name} on Twitter`}
              >
                𝕏
              </a>
              <a
                href={member.linkedin}
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label={`${member.name} on LinkedIn`}
              >
                💼
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
