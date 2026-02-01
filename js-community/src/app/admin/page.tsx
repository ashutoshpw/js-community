/**
 * Admin Dashboard Page
 *
 * Shows overview metrics and quick actions.
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <AdminDashboardClient />
      </Suspense>
    </div>
  );
}
