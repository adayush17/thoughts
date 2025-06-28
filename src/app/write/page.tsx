"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

export default function WritePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
    ],
    content: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: editor?.getHTML() || "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      const data = await response.json();
      router.push(`/posts/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to write</h1>
        <p className="text-gray-600">
          You need to be signed in to create a post.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Write a story</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-0 p-0"
          />
        </div>

        <div className="prose max-w-none">
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
} 