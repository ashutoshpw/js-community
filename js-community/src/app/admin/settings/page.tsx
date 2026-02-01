/**
 * Admin Settings Page
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { SettingsClient } from "./SettingsClient";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Site Settings
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <SettingsClient />
      </Suspense>
    </div>
  );
}
