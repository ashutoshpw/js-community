/**
 * Categories Page
 *
 * Displays all forum categories.
 */

import { CategoryCard } from "@/app/components/forum/CategoryCard";
import { NoCategoriesFound } from "@/app/components/forum/EmptyState";

// Placeholder categories until the API is connected to a real database
const placeholderCategories = [
  {
    id: 1,
    name: "General Discussion",
    slug: "general",
    color: "#3B82F6",
    description:
      "Chat about anything related to the JavaScript community. Introduce yourself, share news, or just hang out.",
    topicCount: 156,
    subcategories: [],
  },
  {
    id: 2,
    name: "JavaScript",
    slug: "javascript",
    color: "#F59E0B",
    description:
      "Discussions about vanilla JavaScript, ES6+, and core language features.",
    topicCount: 423,
    subcategories: [
      { id: 21, name: "ES6+", slug: "es6", color: "#F59E0B" },
      { id: 22, name: "DOM & Events", slug: "dom-events", color: "#F59E0B" },
    ],
  },
  {
    id: 3,
    name: "TypeScript",
    slug: "typescript",
    color: "#3178C6",
    description:
      "Everything TypeScript - types, interfaces, generics, and more.",
    topicCount: 287,
    subcategories: [],
  },
  {
    id: 4,
    name: "React",
    slug: "react",
    color: "#61DAFB",
    description:
      "React components, hooks, state management, and ecosystem discussions.",
    topicCount: 512,
    subcategories: [
      { id: 41, name: "Hooks", slug: "react-hooks", color: "#61DAFB" },
      { id: 42, name: "Next.js", slug: "nextjs", color: "#000000" },
    ],
  },
  {
    id: 5,
    name: "Node.js",
    slug: "nodejs",
    color: "#339933",
    description: "Server-side JavaScript with Node.js, Express, and more.",
    topicCount: 198,
    subcategories: [],
  },
  {
    id: 6,
    name: "Help & Support",
    slug: "help",
    color: "#10B981",
    description:
      "Need help with your code? Post your questions here and get help from the community.",
    topicCount: 892,
    subcategories: [],
  },
  {
    id: 7,
    name: "Show & Tell",
    slug: "show-tell",
    color: "#8B5CF6",
    description:
      "Share your projects, demos, and creations with the community.",
    topicCount: 134,
    subcategories: [],
  },
  {
    id: 8,
    name: "Career & Jobs",
    slug: "career",
    color: "#EC4899",
    description: "Career advice, job postings, and professional development.",
    topicCount: 76,
    subcategories: [],
  },
];

export default async function CategoriesPage() {
  // In production, this would fetch from the API
  const categories = placeholderCategories;

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <NoCategoriesFound />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Categories
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
