"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: string;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-red-600 hover:text-red-900 ${
          isDeleting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isDeleting
          ? "Deleting..."
          : showConfirm
          ? "Click again to confirm"
          : "Delete"}
      </button>
      {showConfirm && !isDeleting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-700">
            Are you sure you want to delete this post? This action cannot be undone.
          </div>
        </div>
      )}
    </div>
  );
} 