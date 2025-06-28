"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      const params = new URLSearchParams(searchParams);
      params.set("q", debouncedQuery);
      params.set("type", type);
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    }
  }, [debouncedQuery, type, router, searchParams]);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search posts and users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="all">All</option>
        <option value="posts">Posts</option>
        <option value="users">Users</option>
      </select>
    </div>
  );
} 