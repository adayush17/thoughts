import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  bio: z.string().max(160, "Bio is too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
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

    if (session.user.id !== params.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 