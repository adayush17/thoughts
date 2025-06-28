import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/posts/PostCard";
import { Suspense } from "react";
import Feed from "@/components/feed/Feed";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import CategoryFilter from "@/components/feed/CategoryFilter";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <CategoryFilter categories={categories} />
        </div>
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />
        </Suspense>
      </div>
    </div>
  );
} 