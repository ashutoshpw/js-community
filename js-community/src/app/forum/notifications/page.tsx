/**
 * Notifications page
 *
 * Displays all user notifications with filtering options.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NotificationsClient } from "./NotificationsClient";

export const metadata = {
  title: "Notifications - JS Community",
  description: "View your notifications",
};

export default async function NotificationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/forum/login?redirect=/forum/notifications");
  }

  return <NotificationsClient />;
}
