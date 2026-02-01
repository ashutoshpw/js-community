/**
 * Category Topics Page
 *
 * Displays topics within a specific category.
 */

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/app/components/forum/Breadcrumbs";
import { TopicList } from "@/app/components/forum/TopicList";
import { TopicListHeader } from "@/app/components/forum/TopicListHeader";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

// Placeholder categories until connected to database
const categoryMap: Record<
  string,
  { id: number; name: string; color: string; description?: string }
> = {
  general: {
    id: 1,
    name: "General Discussion",
    color: "#3B82F6",
    description: "Chat about anything related to the JavaScript community.",
  },
  javascript: {
    id: 2,
    name: "JavaScript",
    color: "#F59E0B",
    description:
      "Discussions about vanilla JavaScript, ES6+, and core language features.",
  },
  typescript: {
    id: 3,
    name: "TypeScript",
    color: "#3178C6",
    description:
      "Everything TypeScript - types, interfaces, generics, and more.",
  },
  react: {
    id: 4,
    name: "React",
    color: "#61DAFB",
    description:
      "React components, hooks, state management, and ecosystem discussions.",
  },
  nextjs: {
    id: 5,
    name: "Next.js",
    color: "#000000",
    description: "Next.js framework discussions, App Router, and deployment.",
  },
  nodejs: {
    id: 6,
    name: "Node.js",
    color: "#339933",
    description: "Server-side JavaScript with Node.js, Express, and more.",
  },
  help: {
    id: 7,
    name: "Help & Support",
    color: "#10B981",
    description: "Need help with your code? Post your questions here.",
  },
  "show-tell": {
    id: 8,
    name: "Show & Tell",
    color: "#8B5CF6",
    description:
      "Share your projects, demos, and creations with the community.",
  },
};

async function getTopics(categorySlug: string, page: number, sort: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(
      `${baseUrl}/api/forum/topics?page=${page}&sort=${sort}&category=${categorySlug}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return { topics: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageParam, sort: sortParam } = await searchParams;

  const category = categoryMap[slug];
  if (!category) {
    notFound();
  }

  const page = Math.max(1, Number.parseInt(pageParam || "1", 10));
  const sort = sortParam || "latest";
  const data = await getTopics(slug, page, sort);

  const bgColor = category.color.startsWith("#")
    ? category.color
    : `#${category.color}`;

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/forum/categories" },
          { label: category.name },
        ]}
        className="mb-4"
      />

      {/* Category header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded"
            style={{ backgroundColor: bgColor }}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {category.name}
          </h1>
        </div>
        {category.description && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {category.description}
          </p>
        )}
      </div>

      {/* Topic list */}
      <TopicListHeader baseUrl={`/forum/c/${slug}`} currentSort={sort} />

      <div className="mt-4">
        <TopicList
          topics={data.topics}
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
          }}
          baseUrl={`/forum/c/${slug}/${sort}`}
        />
      </div>
    </div>
  );
}
