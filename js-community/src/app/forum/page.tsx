/**
 * Forum Home Page
 *
 * Redirects to /forum/latest for the main topic listing.
 */

import { redirect } from "next/navigation";

export default function ForumHomePage() {
  redirect("/forum/latest");
}
