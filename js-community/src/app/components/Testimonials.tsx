"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    body: "This community has been instrumental in my growth as a developer. The supportive environment and quality discussions helped me land my dream job!",
    author: {
      name: "Sarah Chen",
      handle: "@sarahcodes",
      role: "Senior Frontend Developer",
    },
  },
  {
    body: "I've learned more from the community discussions and code reviews here than from any online course. The real-world insights are invaluable.",
    author: {
      name: "Marcus Johnson",
      handle: "@marcusjs",
      role: "Full Stack Developer",
    },
  },
  {
    body: "As a beginner, I was intimidated to ask questions. But this community welcomed me with open arms. Now I'm confident enough to help others too!",
    author: {
      name: "Priya Sharma",
      handle: "@priya_dev",
      role: "Junior Developer",
    },
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Loved by developers worldwide
          </motion.h2>
          <motion.p
            className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Don't just take our word for it. Here's what our community members
            have to say.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author.handle}
                className="rounded-2xl bg-gray-50 p-8 dark:bg-zinc-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <figure className="flex flex-col justify-between h-full">
                  <blockquote className="text-base leading-7 text-gray-700 dark:text-gray-300">
                    <p>"{testimonial.body}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
                      {testimonial.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.author.role}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
