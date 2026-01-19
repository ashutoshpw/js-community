import type { Metadata } from "next";
import Contact from "./components/Contact";
import Mission from "./components/Mission";
import Statistics from "./components/Statistics";
import Team from "./components/Team";
import Timeline from "./components/Timeline";
import Values from "./components/Values";

export const metadata: Metadata = {
  title: "About Us | JS Community",
  description:
    "Learn about the JS Community mission, values, and the team behind the platform. Join our vibrant community of JavaScript developers.",
  keywords: [
    "about",
    "mission",
    "values",
    "team",
    "JavaScript community",
    "developers",
    "leadership",
  ],
  openGraph: {
    title: "About Us | JS Community",
    description:
      "Learn about the JS Community mission, values, and the team behind the platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | JS Community",
    description:
      "Learn about the JS Community mission, values, and the team behind the platform.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            About JS Community
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Empowering JavaScript developers to learn, share, and grow together
            through knowledge and collaboration.
          </p>
        </div>

        {/* Mission Section */}
        <Mission />

        {/* Values Section */}
        <Values />

        {/* Team Section */}
        <Team />

        {/* Statistics Section */}
        <Statistics />

        {/* Timeline Section */}
        <Timeline />

        {/* Contact Section */}
        <Contact />
      </div>
    </div>
  );
}
