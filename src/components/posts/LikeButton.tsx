"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isLiked: boolean;
}

export default function LikeButton({
  postId,
  initialLikes,
  isLiked: initialIsLiked,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (!session) {
      // Redirect to login or show login modal
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      setIsLiked(!isLiked);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
        isLiked
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-gray-50 text-gray-600 border-gray-200"
      } hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors`}
    >
      <Heart
        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
        strokeWidth={isLiked ? 0 : 2}
      />
      <span>{likes}</span>
    </button>
  );
} 