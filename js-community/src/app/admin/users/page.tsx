/**
 * Admin Users Page
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { UsersClient } from "./UsersClient";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        User Management
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <UsersClient />
      </Suspense>
    </div>
  );
}
