/**
 * New Message Page
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { NewMessageClient } from "./NewMessageClient";

export const metadata: Metadata = {
  title: "New Message | JS Community",
  description: "Start a new conversation",
};

export default function NewMessagePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <NewMessageClient />
      </Suspense>
    </div>
  );
}
