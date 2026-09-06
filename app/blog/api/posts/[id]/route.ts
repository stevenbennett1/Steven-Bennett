import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validation";
import { resolvePublishedAt, resolveTagIds, postListInclude, ScheduleError } from "@/lib/posts";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: postListInclude });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string } | undefined)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  let publishedAt: Date | null;
  try {
    publishedAt = resolvePublishedAt(data.status, data.publishedAt);
  } catch (err) {
    if (err instanceof ScheduleError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const tagIds = await resolveTagIds(data.tags);

  const post = await prisma.$transaction(async (tx) => {
    await tx.postTag.deleteMany({ where: { postId: id } });
    await tx.postCategory.deleteMany({ where: { postId: id } });
    await tx.attachment.deleteMany({ where: { postId: id } });

    return tx.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt || null,
        contentJson: data.contentJson,
        contentHtml: data.contentHtml,
        coverImageUrl: data.coverImageUrl || null,
        videoUrl: data.videoUrl || null,
        status: data.status,
        publishedAt,
        categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
        attachments: {
          create: (data.attachments || []).map((a) => ({
            url: a.url,
            publicId: a.publicId || null,
            fileName: a.fileName,
            type: a.type,
          })),
        },
      },
      include: postListInclude,
    });
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string } | undefined)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
