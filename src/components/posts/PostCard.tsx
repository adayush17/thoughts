"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Post, User } from "@prisma/client";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: Post & {
    categories: {
      category: {
        id: string;
        name: string;
        slug: string;
      };
    }[];
  };
  author: User;
  likesCount: number;
  commentsCount: number;
}

export default function PostCard({
  post,
  author,
  likesCount,
  commentsCount,
}: PostCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <Link href={`/users/${author.id}`} className="flex-shrink-0">
          <Image
            src={author.image || "/images/placeholder.png"}
            alt={author.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>
        <div>
          <Link
            href={`/users/${author.id}`}
            className="font-medium text-gray-900 hover:text-green-600"
          >
            {author.name}
          </Link>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="mt-4 block">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-green-600">
          {post.title}
        </h2>
        <div
          className="prose prose-green max-w-none line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Link>

      {post.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.categories.map(({ category }) => (
            <Link
              key={category.id}
              href={`/feed?categoryId=${category.id}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center space-x-4">
        <LikeButton postId={post.id} initialLikesCount={likesCount} />
        <Link
          href={`/posts/${post.id}#comments`}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <span>{commentsCount}</span>
        </Link>
      </div>
    </article>
  );
} 