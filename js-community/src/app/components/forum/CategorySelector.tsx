/**
 * CategorySelector component
 *
 * Dropdown for selecting a category for a topic.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  description?: string | null;
}

interface CategorySelectorProps {
  value: number | null;
  onChange: (categoryId: number | null) => void;
  disabled?: boolean;
  required?: boolean;
}

export function CategorySelector({
  value,
  onChange,
  disabled = false,
  required = false,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    fetch("/api/forum/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-500"
            : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-500"
        }`}
      >
        {isLoading ? (
          <span className="text-gray-400 dark:text-gray-500">Loading...</span>
        ) : selectedCategory ? (
          <span className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: selectedCategory.color || "#6b7280" }}
            />
            {selectedCategory.name}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">
            {required ? "Select a category..." : "No category (optional)"}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {/* No category option */}
          {!required && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
            >
              {value === null && <Check className="h-4 w-4 text-blue-600" />}
              <span className={value === null ? "ml-6" : ""}>No category</span>
            </button>
          )}

          {/* Category list */}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onChange(category.id);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              {value === category.id && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
              <span
                className={`flex items-center gap-2 ${value === category.id ? "" : "ml-6"}`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color || "#6b7280" }}
                />
                <span className="text-gray-900 dark:text-white">
                  {category.name}
                </span>
              </span>
            </button>
          ))}

          {categories.length === 0 && !isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No categories available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
