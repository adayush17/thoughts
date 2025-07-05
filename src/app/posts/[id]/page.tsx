import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LikeButton from "@/components/posts/LikeButton";
import CommentSection from "@/components/posts/CommentSection";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      likes: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const isLiked = session?.user
    ? post.likes.some((like) => like.userId === session.user.id)
    : false;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || "Author"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <LikeButton
            postId={post.id}
            initialLikes={post.likes.length}
            isLiked={isLiked}
          />
        </div>
      </header>

      <div
        className="prose max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentSection
        postId={post.id}
        comments={post.comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt.toISOString()
        }))}
        user={session?.user ? {
          id: session.user.id,
          name: session.user.name ?? null,
          image: session.user.image ?? null
        } : null}
      />
    </article>
  );
} 