/**
 * UserAvatar component
 *
 * Displays a user's avatar with fallback to initials.
 */

import Image from "next/image";

interface UserAvatarProps {
  user: {
    name?: string | null;
    username: string;
    avatarUrl?: string | null;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

/**
 * Generate initials from name or username
 */
function getInitials(name?: string | null, username?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (username) {
    return username.slice(0, 2).toUpperCase();
  }
  return "??";
}

/**
 * Generate a consistent background color from username
 */
function getAvatarColor(username: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

const sizePx = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const initials = getInitials(user.name, user.username);
  const bgColor = getAvatarColor(user.username);

  // Check if user has a profile with avatar URL
  const avatarUrl = user.avatarUrl;

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={user.name || user.username}
        width={sizePx[size]}
        height={sizePx[size]}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-medium text-white ${bgColor} ${sizeClasses[size]} ${className}`}
      title={user.name || user.username}
    >
      {initials}
    </div>
  );
}
