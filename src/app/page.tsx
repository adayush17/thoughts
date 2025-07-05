import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Jazbaat
        </h1>
        <p className="text-xl text-gray-600">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/posts/${post.id}`} className="hover:text-green-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="flex items-center">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || "Author"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span className="text-sm text-gray-500">
                    {post.author.name}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
