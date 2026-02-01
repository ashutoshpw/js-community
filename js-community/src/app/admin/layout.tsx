/**
 * Admin Layout
 *
 * Provides navigation sidebar and admin-only access check.
 */

import {
  BarChart,
  Flag,
  FolderTree,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "Admin Dashboard | JS Community",
  description: "Admin dashboard for site management",
};

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/categories", icon: FolderTree, label: "Categories" },
  { href: "/admin/review", icon: Flag, label: "Review Queue" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    redirect("/forum");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
          <div className="mb-4 px-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 pt-4 dark:border-zinc-800">
            <Link
              href="/forum"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
            >
              <BarChart className="h-5 w-5" />
              <span>Back to Forum</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
