"use client";

import { useRouter } from "next/navigation";
import { Composer } from "@/app/components/forum/Composer";

export function NewTopicClient() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title?: string;
    content: string;
    categoryId?: number | null;
    tags?: string[];
  }) => {
    const response = await fetch("/api/forum/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        tags: data.tags,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create topic");
    }

    const result = await response.json();
    router.push(`/forum/t/${result.topic.id}/${result.topic.slug}`);
    router.refresh();
  };

  return (
    <Composer
      mode="new-topic"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
