/**
 * Admin Categories Client Component
 */

"use client";

import { Edit, FolderPlus, GripVertical, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  textColor: string | null;
  position: number;
  topicCount: number;
  postCount: number;
  parentId: number | null;
}

export function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#0088CC",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/forum/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "#0088CC",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        fetchCategories();
        setEditingId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.name || !newCategory.slug) {
      alert("Name and slug are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (res.ok) {
        fetchCategories();
        setIsCreating(false);
        setNewCategory({
          name: "",
          slug: "",
          description: "",
          color: "#0088CC",
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FolderPlus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-medium">Create Category</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-name"
                className="mb-1 block text-sm font-medium"
              >
                Name
              </label>
              <input
                id="new-name"
                type="text"
                value={newCategory.name}
                onChange={(e) => {
                  setNewCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  }));
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
            <div>
              <label
                htmlFor="new-slug"
                className="mb-1 block text-sm font-medium"
              >
                Slug
              </label>
              <input
                id="new-slug"
                type="text"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="new-description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="new-description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
            <div>
              <label
                htmlFor="new-color"
                className="mb-1 block text-sm font-medium"
              >
                Color
              </label>
              <input
                id="new-color"
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, color: e.target.value }))
                }
                className="h-10 w-20 cursor-pointer rounded border border-gray-200 dark:border-zinc-700"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Create
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {categories.map((category) => (
              <div key={category.id} className="p-4">
                {editingId === category.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Name"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <input
                        type="text"
                        value={editForm.slug || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        placeholder="Slug"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                    <textarea
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description"
                      rows={2}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <div className="flex items-center justify-between">
                      <input
                        type="color"
                        value={editForm.color || "#0088CC"}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="h-8 w-16 cursor-pointer rounded border"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 dark:border-zinc-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 cursor-grab text-gray-400" />
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: category.color || "#0088CC" }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-500">
                        <p>{category.topicCount} topics</p>
                        <p>{category.postCount} posts</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
