import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    console.error("[POST_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Delete all related records first
    await prisma.$transaction([
      prisma.like.deleteMany({
        where: { postId: params.id },
      }),
      prisma.comment.deleteMany({
        where: { postId: params.id },
      }),
      prisma.post.delete({
        where: { id: params.id },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[POST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 