"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category } from "@prisma/client";
import RichTextEditor from "@/components/editor/RichTextEditor";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  categories: Category[];
}

export default function CreatePostForm({ categories }: CreatePostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      categoryIds: [],
    },
  });

  const content = watch("content");

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }

      const post = await response.json();
      router.push(`/posts/${post.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="title"
            {...register("title")}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="categories"
          className="block text-sm font-medium text-gray-700"
        >
          Categories
        </label>
        <div className="mt-1">
          <select
            id="categories"
            multiple
            {...register("categoryIds")}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryIds && (
            <p className="mt-1 text-sm text-red-600">
              {errors.categoryIds.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <div className="mt-1">
          <RichTextEditor
            content={content}
            onChange={(content) => setValue("content", content)}
            placeholder="Write your post content..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </div>
    </form>
  );
} 