/**
 * Search page
 *
 * Full search results with filtering options.
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { SearchClient } from "./SearchClient";

export const metadata = {
  title: "Search - JS Community",
  description: "Search topics and posts in JS Community",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    user?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <SearchClient
        initialQuery={params.q || ""}
        initialType={params.type || "all"}
        initialCategory={params.category}
        initialUser={params.user}
      />
    </Suspense>
  );
}
