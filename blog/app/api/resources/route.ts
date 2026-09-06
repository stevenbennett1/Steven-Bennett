import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resourceSchema } from "@/lib/validation";

export async function GET() {
  const resources = await prisma.resource.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string } | undefined)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const resource = await prisma.resource.create({
    data: {
      title: data.title,
      type: data.type,
      creator: data.creator || null,
      url: data.url,
      coverImageUrl: data.coverImageUrl || null,
      description: data.description || null,
      featured: data.featured ?? false,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
