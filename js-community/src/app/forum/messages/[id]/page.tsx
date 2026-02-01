/**
 * Conversation Detail Page
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { ConversationClient } from "./ConversationClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: _id } = await params;
  return {
    title: `Conversation | JS Community`,
    description: "Private message conversation",
  };
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <ConversationClient conversationId={id} />
      </Suspense>
    </div>
  );
}
