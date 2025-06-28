"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  followersCount: number;
}

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  followersCount: initialFollowersCount,
}: FollowButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFollow() {
    if (!session) {
      // Redirect to login or show login modal
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      router.refresh();
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-6 py-2 rounded-full border ${
        isFollowing
          ? "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
          : "bg-green-600 text-white border-transparent hover:bg-green-700"
      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading
        ? "Updating..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>
  );
} 