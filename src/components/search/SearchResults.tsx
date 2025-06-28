"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/posts/PostCard";
import UserCard from "@/components/users/UserCard";
import { Post, User } from "@prisma/client";

interface SearchResultsProps {
  query: string;
  type: string;
  page: number;
}

interface SearchResponse {
  posts: (Post & {
    author: Pick<User, "id" | "name" | "image">;
    _count: {
      likes: number;
      comments: number;
    };
  })[];
  users: (User & {
    _count: {
      followers: number;
      following: number;
      posts: number;
    };
  })[];
  total: number;
  hasMore: boolean;
}

export default function SearchResults({ query, type, page }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        setError("Failed to load search results. Please try again.");
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [query, type, page]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Enter a search query to get started.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!results || (results.posts.length === 0 && results.users.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {type !== "users" && results.posts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <div className="space-y-6">
            {results.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={post.author}
                likesCount={post._count.likes}
                commentsCount={post._count.comments}
              />
            ))}
          </div>
        </div>
      )}

      {type !== "posts" && results.users.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {results.hasMore && (
        <div className="text-center">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (page + 1).toString());
              router.push(`/search?${params.toString()}`);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 