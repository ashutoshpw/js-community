/**
 * LoadingSpinner component
 *
 * A simple loading indicator for async operations.
 */

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-gray-500 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
    />
  );
}

/**
 * Full-page loading state
 */
export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

/**
 * Inline loading state with optional text
 */
export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <LoadingSpinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
