/**
 * Top Topics Page
 *
 * Displays topics sorted by most likes.
 */

import { TopicList } from "@/app/components/forum/TopicList";
import { TopicListHeader } from "@/app/components/forum/TopicListHeader";
import { getForumTopics } from "@/lib/forum-data";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getTopics(page: number) {
  try {
    return await getForumTopics({ page, sort: "top" });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return {
      topics: [],
      pagination: { page: 1, perPage: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
    };
  }
}

export default async function TopTopicsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10));
  const data = await getTopics(page);

  return (
    <div>
      <TopicListHeader currentSort="top" />

      <div className="mt-4">
        <TopicList
          topics={data.topics}
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
          }}
          baseUrl="/forum/top"
        />
      </div>
    </div>
  );
}
