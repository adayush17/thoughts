import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const like = await prisma.like.create({
      data: {
        postId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    console.error("Like creation error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id,
        },
      },
    });

    return NextResponse.json({ message: "Like removed" });
  } catch (error) {
    console.error("Like deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 