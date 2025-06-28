import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import DeletePostButton from "@/components/posts/DeletePostButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/write"
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Write a Post
        </Link>
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-600">
              Start writing your first post to share your thoughts with the world.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span>•</span>
                    <span>{post._count.likes} likes</span>
                    <span>•</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 