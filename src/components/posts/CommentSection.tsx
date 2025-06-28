"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export default function CommentSection({
  postId,
  comments: initialComments,
  user,
}: CommentSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setNewComment("");
      router.refresh();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Comments</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className="w-full rounded-lg border border-gray-300 p-4 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600">
          Please{" "}
          <a href="/login" className="text-green-600 hover:text-green-500">
            sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            {comment.author.image && (
              <Image
                src={comment.author.image}
                alt={comment.author.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 