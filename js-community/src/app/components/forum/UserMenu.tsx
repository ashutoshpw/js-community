/**
 * UserMenu component
 *
 * User dropdown menu showing profile, settings, and logout options.
 * Shows login/register buttons for anonymous users.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { UserAvatar } from "./UserAvatar";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/forum");
    router.refresh();
  };

  // Loading state
  if (isPending) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700" />
    );
  }

  // Anonymous user - show login/register buttons
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/forum/login"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
        >
          Log in
        </Link>
        <Link
          href="/forum/register"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Sign up
        </Link>
      </div>
    );
  }

  // Authenticated user - show dropdown
  const user = session.user;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserAvatar
          user={{
            name: user.name,
            username: user.email?.split("@")[0] || "user",
            avatarUrl: user.image,
          }}
          size="sm"
        />
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {/* User info header */}
          <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-700">
            <p className="font-medium text-gray-900 dark:text-white">
              {user.name || user.email?.split("@")[0]}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <MenuLink
              href={`/forum/u/${user.email?.split("@")[0]}`}
              icon={User}
              onClick={() => setIsOpen(false)}
            >
              Your Profile
            </MenuLink>
            <MenuLink
              href="/forum/bookmarks"
              icon={Bookmark}
              onClick={() => setIsOpen(false)}
            >
              Bookmarks
            </MenuLink>
            <MenuLink
              href="/forum/messages"
              icon={MessageSquare}
              onClick={() => setIsOpen(false)}
            >
              Messages
            </MenuLink>
            <MenuLink
              href="/forum/settings"
              icon={Settings}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </MenuLink>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1 dark:border-zinc-700">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-zinc-700"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
