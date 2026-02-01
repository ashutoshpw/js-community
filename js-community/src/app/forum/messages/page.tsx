/**
 * Messages List Page
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/app/components/forum/LoadingSpinner";
import { MessagesClient } from "./MessagesClient";

export const metadata: Metadata = {
  title: "Messages | JS Community",
  description: "Your private messages",
};

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <MessagesClient />
      </Suspense>
    </div>
  );
}
