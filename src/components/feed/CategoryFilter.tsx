"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId");

  const handleCategoryChange = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    router.push(`/feed?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          !selectedCategoryId
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selectedCategoryId === category.id
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 