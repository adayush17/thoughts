"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  bio: z.string().max(160, "Bio is too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

interface ProfileSettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
  };
}

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const validatedData = profileSchema.parse({
        name,
        bio: bio || undefined,
        image: image || undefined,
      });

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: validatedData.name,
          image: validatedData.image,
        },
      });

      setSuccess("Profile updated successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md">{success}</div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Email cannot be changed
        </p>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Tell us about yourself"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Profile Image URL
        </label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="https://example.com/your-image.jpg"
        />
        {image && (
          <div className="mt-2">
            <Image
              src={image}
              alt="Profile preview"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
} 