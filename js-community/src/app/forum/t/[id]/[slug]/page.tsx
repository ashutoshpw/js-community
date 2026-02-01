/**
 * Topic Detail Page
 *
 * Displays a topic with all its posts.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TopicHeader } from "@/app/components/forum/TopicHeader";
import { TopicDetailClient } from "./TopicDetailClient";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

async function getTopic(id: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/forum/topics/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch topic");
  }

  return response.json();
}

async function getPosts(topicId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/forum/topics/${topicId}/posts?per_page=20`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const topicId = Number.parseInt(id, 10);

  if (Number.isNaN(topicId)) {
    return { title: "Topic Not Found" };
  }

  try {
    const data = await getTopic(topicId);
    if (!data?.topic) {
      return { title: "Topic Not Found" };
    }

    return {
      title: `${data.topic.title} - JS Community`,
      description: `Discussion: ${data.topic.title}`,
    };
  } catch {
    return { title: "Topic Not Found" };
  }
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { id, slug } = await params;
  const topicId = Number.parseInt(id, 10);

  if (Number.isNaN(topicId)) {
    notFound();
  }

  const [topicData, postsData] = await Promise.all([
    getTopic(topicId),
    getPosts(topicId),
  ]);

  if (!topicData?.topic) {
    notFound();
  }

  const { topic } = topicData;

  // Redirect to correct slug if needed
  if (slug !== topic.slug) {
    redirect(`/forum/t/${topic.id}/${topic.slug}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <TopicHeader topic={topic} />

      <div className="mt-6">
        <TopicDetailClient
          topic={topic}
          initialPosts={postsData.posts}
          initialPagination={postsData.pagination}
        />
      </div>
    </div>
  );
}
