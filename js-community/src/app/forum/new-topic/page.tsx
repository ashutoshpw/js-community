/**
 * Create New Topic Page
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/app/components/forum/Breadcrumbs";
import { getServerSession } from "@/lib/session";
import { NewTopicClient } from "./NewTopicClient";

export const dynamic = "force-dynamic";

export default async function NewTopicPage() {
  const session = await getServerSession(await headers());
  if (!session?.user) {
    redirect("/forum/login?redirect=/forum/new-topic");
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Forum", href: "/forum" }, { label: "New Topic" }]}
        className="mb-4"
      />
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Create New Topic
      </h1>
      <NewTopicClient />
    </div>
  );
}
