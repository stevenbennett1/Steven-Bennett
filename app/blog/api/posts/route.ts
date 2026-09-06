import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validation";
import { generateUniqueSlug, resolvePublishedAt, resolveTagIds, postListInclude, ScheduleError } from "@/lib/posts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");

  const posts = await prisma.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(categoryId ? { categories: { some: { categoryId } } } : {}),
    },
    include: postListInclude,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const slug = await generateUniqueSlug(data.title);
  const tagIds = await resolveTagIds(data.tags);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      contentJson: data.contentJson,
      contentHtml: data.contentHtml,
      coverImageUrl: data.coverImageUrl || null,
      videoUrl: data.videoUrl || null,
      status: data.status,
      publishedAt,
      authorId: userId,
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

  return NextResponse.json(post, { status: 201 });
}
