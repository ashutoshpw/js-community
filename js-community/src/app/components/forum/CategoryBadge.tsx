/**
 * CategoryBadge component
 *
 * Inline badge for displaying a category with its color.
 */

import Link from "next/link";

interface CategoryBadgeProps {
  category: {
    id?: number;
    name: string;
    slug: string;
    color: string;
  };
  size?: "sm" | "md";
  linked?: boolean;
}

export function CategoryBadge({
  category,
  size = "md",
  linked = true,
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
  };

  // Ensure color has # prefix
  const bgColor = category.color.startsWith("#")
    ? category.color
    : `#${category.color}`;

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${bgColor}20`,
        color: bgColor,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: bgColor }}
      />
      {category.name}
    </span>
  );

  if (linked) {
    return (
      <Link
        href={`/forum/c/${category.slug}`}
        className="transition-opacity hover:opacity-80"
      >
        {badge}
      </Link>
    );
  }

  return badge;
}

/**
 * List of category badges
 */
export function CategoryBadgeList({
  categories,
  size = "sm",
}: {
  categories: CategoryBadgeProps["category"][];
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((category) => (
        <CategoryBadge key={category.slug} category={category} size={size} />
      ))}
    </div>
  );
}
