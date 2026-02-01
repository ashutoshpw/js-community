/**
 * Latest Topics Page
 *
 * Displays topics sorted by most recent activity.
 */

import { TopicList } from "@/app/components/forum/TopicList";
import { TopicListHeader } from "@/app/components/forum/TopicListHeader";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getTopics(page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(
      `${baseUrl}/api/forum/topics?page=${page}&sort=latest`,
      {
        cache: "no-store",
      }
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

export default async function LatestTopicsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1"));
  const data = await getTopics(page);

  return (
    <div>
      <TopicListHeader currentSort="latest" />

      <div className="mt-4">
        <TopicList
          topics={data.topics}
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
          }}
          baseUrl="/forum/latest"
        />
      </div>
    </div>
  );
}
