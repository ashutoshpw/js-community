/**
 * Header component
 *
 * Main navigation header for the forum.
 */

import Link from "next/link";
import { MessageSquare, PenSquare } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section: Logo + Mobile menu */}
        <div className="flex items-center gap-4">
          <MobileNav categories={categories} />

          {/* Logo */}
          <Link href="/forum" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-lg font-bold text-gray-900 dark:text-white sm:block">
              JS Community
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            <NavLink href="/forum/latest">Latest</NavLink>
            <NavLink href="/forum/top">Top</NavLink>
            <NavLink href="/forum/categories">Categories</NavLink>
          </nav>
        </div>

        {/* Right section: Search, New Topic, Notifications, User */}
        <div className="flex items-center gap-2">
          <SearchBar />

          {/* New Topic button (desktop) */}
          <Link
            href="/forum/new-topic"
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:flex"
          >
            <PenSquare className="h-4 w-4" />
            <span className="hidden md:inline">New Topic</span>
          </Link>

          {/* Notifications */}
          <div className="hidden sm:block">
            <NotificationBell unreadCount={0} />
          </div>

          {/* User menu (desktop only, mobile has it in drawer) */}
          <div className="hidden lg:block">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}
