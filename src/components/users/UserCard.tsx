"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import FollowButton from "@/components/profile/FollowButton";

interface UserCardProps {
  user: User & {
    _count: {
      followers: number;
      following: number;
      posts: number;
    };
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <Link href={`/profile/${user.id}`} className="flex-shrink-0">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${user.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-green-600 truncate"
          >
            {user.name}
          </Link>
          {user.bio && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-4 text-sm text-gray-500">
          <div>
            <span className="font-medium text-gray-900">{user._count.posts}</span>{" "}
            posts
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {user._count.followers}
            </span>{" "}
            followers
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {user._count.following}
            </span>{" "}
            following
          </div>
        </div>
        <FollowButton userId={user.id} />
      </div>
    </div>
  );
} 