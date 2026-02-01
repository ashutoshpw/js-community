/**
 * Notification Preferences page
 *
 * User settings for notification delivery.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PreferencesClient } from "./PreferencesClient";

export const metadata = {
  title: "Notification Preferences - JS Community",
  description: "Manage your notification settings",
};

export default async function NotificationPreferencesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/forum/login?redirect=/forum/notifications/preferences");
  }

  return <PreferencesClient />;
}
