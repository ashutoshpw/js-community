/**
 * EmptyState component
 *
 * Displays a friendly message when there's no content to show.
 */

import {
  FolderOpen,
  type LucideIcon,
  MessageSquare,
  Search,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-800">
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Preset empty states for common scenarios
 */

export function NoTopicsFound() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No topics yet"
      description="Be the first to start a discussion in this community."
    />
  );
}

export function NoCategoriesFound() {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No categories"
      description="Categories will appear here once they're created."
    />
  );
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search terms or filters."
    />
  );
}
