import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditPostForm from "@/components/posts/EditPostForm";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
} 