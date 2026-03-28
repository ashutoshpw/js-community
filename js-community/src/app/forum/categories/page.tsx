/**
 * Categories Page
 *
 * Displays all forum categories.
 */

import { CategoryCard } from "@/app/components/forum/CategoryCard";
import { NoCategoriesFound } from "@/app/components/forum/EmptyState";
import { getForumCategories } from "@/lib/forum-data";

export default async function CategoriesPage() {
  const categories = await getForumCategories();

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <NoCategoriesFound />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Categories
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
