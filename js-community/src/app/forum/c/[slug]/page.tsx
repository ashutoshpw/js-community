/**
 * Category Topics Page
 *
 * Displays topics within a specific category.
 */

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/app/components/forum/Breadcrumbs";
import { TopicList } from "@/app/components/forum/TopicList";
import { TopicListHeader } from "@/app/components/forum/TopicListHeader";
import { getForumCategoryBySlug, getForumTopics } from "@/lib/forum-data";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

async function getTopics(categorySlug: string, page: number, sort: string) {
  try {
    return await getForumTopics({ page, sort, categorySlug });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return {
      topics: [],
      pagination: { page: 1, perPage: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageParam, sort: sortParam } = await searchParams;

  const category = await getForumCategoryBySlug(slug);
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
