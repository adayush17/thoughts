import { Suspense } from "react";
import SearchResults from "@/components/search/SearchResults";
import SearchResultsSkeleton from "@/components/search/SearchResultsSkeleton";

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
    page?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const type = searchParams.type || "all";
  const page = parseInt(searchParams.page || "1");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Search results for "${query}"` : "Search"}
      </h1>

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} type={type} page={page} />
      </Suspense>
    </div>
  );
} 