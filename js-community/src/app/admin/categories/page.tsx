/**
 * Admin Categories Page
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { CategoriesClient } from "./CategoriesClient";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Category Management
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <CategoriesClient />
      </Suspense>
    </div>
  );
}
