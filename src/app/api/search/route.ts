import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all"; // all, posts, users
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({ posts: [], users: [], total: 0 });
    }

    const searchQuery = {
      contains: query,
      mode: "insensitive" as const,
    };

    const [posts, users, postCount, userCount] = await Promise.all([
      type !== "users"
        ? prisma.post.findMany({
            where: {
              OR: [
                { title: searchQuery },
                { content: searchQuery },
              ],
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            skip,
            take: limit,
          })
        : [],
      type !== "posts"
        ? prisma.user.findMany({
            where: {
              OR: [
                { name: searchQuery },
                { email: searchQuery },
              ],
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  posts: true,
                },
              },
            },
            skip,
            take: limit,
          })
        : [],
      prisma.post.count({
        where: type !== "users" ? {
          OR: [
            { title: searchQuery },
            { content: searchQuery },
          ],
        } : undefined,
      }),
      prisma.user.count({
        where: type !== "posts" ? {
          OR: [
            { name: searchQuery },
            { email: searchQuery },
          ],
        } : undefined,
      }),
    ]);

    const total = postCount + userCount;

    return NextResponse.json({
      posts,
      users,
      total,
      hasMore: skip + posts.length + users.length < total,
    });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 