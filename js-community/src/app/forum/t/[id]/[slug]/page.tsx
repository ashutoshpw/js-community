/**
 * Topic Detail Page
 *
 * Displays a topic with all its posts.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TopicHeader } from "@/app/components/forum/TopicHeader";
import { buildAppUrl } from "@/lib/site-url";
import { TopicDetailClient } from "./TopicDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

async function getTopic(id: number) {
  const response = await fetch(await buildAppUrl(`/api/forum/topics/${id}`), {
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
  const response = await fetch(
    await buildAppUrl(`/api/forum/topics/${topicId}/posts?per_page=20`),
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

    const topic = data.topic;
    const description = topic.firstPostExcerpt
      ? String(topic.firstPostExcerpt).slice(0, 160)
      : `Discussion with ${topic.postsCount ?? 0} replies in JS Community.`;

    return {
      title: topic.title,
      description,
      openGraph: {
        title: topic.title,
        description,
        type: "article",
        publishedTime: topic.createdAt,
        authors: topic.author?.username
          ? [topic.author.username]
          : undefined,
        tags: Array.isArray(topic.tags)
          ? topic.tags.map((t: { name: string }) => t.name)
          : undefined,
      },
      twitter: {
        card: "summary",
        title: topic.title,
        description,
      },
      alternates: {
        canonical: `/forum/t/${topic.id}/${topic.slug}`,
      },
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: topic.title,
    url: `/forum/t/${topic.id}/${topic.slug}`,
    datePublished: topic.createdAt,
    dateModified: topic.updatedAt ?? topic.createdAt,
    author: {
      "@type": "Person",
      name: topic.author?.username ?? "Unknown",
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReplyAction",
        userInteractionCount: topic.replyCount ?? 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: topic.likeCount ?? 0,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe static content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
