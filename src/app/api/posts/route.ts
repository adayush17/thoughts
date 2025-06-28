import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  categories: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("category");
    const skip = (page - 1) * limit;

    const where = categoryId
      ? {
          categories: {
            some: {
              categoryId,
            },
          },
        }
      : undefined;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
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
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        authorId: session.user.id,
        categories: validatedData.categories
          ? {
              create: validatedData.categories.map((categoryId: string) => ({
                category: {
                  connect: {
                    id: categoryId,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    console.error("[POSTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 