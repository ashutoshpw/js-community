/**
 * Admin Review Queue Page
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { ReviewClient } from "./ReviewClient";

export default function AdminReviewPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Review Queue
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <ReviewClient />
      </Suspense>
    </div>
  );
}
