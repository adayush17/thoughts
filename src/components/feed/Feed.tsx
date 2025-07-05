"use client";

import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "@/components/posts/PostCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

async function fetchPosts({ pageParam = 1, categoryId }: { pageParam?: number; categoryId?: string | null }) {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: "10",
  });

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  const response = await fetch(`/api/posts?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export default function Feed() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", categoryId],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchPosts({ pageParam, categoryId }),
    getNextPageParam: (lastPage: unknown) => {
      const page = lastPage as { hasMore?: boolean; posts?: unknown[] };
      if (page.hasMore && page.posts) {
        return page.posts.length / 10 + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "error") {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : "Failed to load posts"}
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading posts...
        </h2>
      </div>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No posts found
        </h2>
        <p className="text-gray-600">
          {categoryId
            ? "No posts in this category yet"
            : "No posts in your feed yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={post.author}
          likesCount={post._count.likes}
          commentsCount={post._count.comments}
        />
      ))}
      <div ref={ref} className="h-4">
        {isFetchingNextPage && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading more posts...</p>
          </div>
        )}
      </div>
    </div>
  );
} 