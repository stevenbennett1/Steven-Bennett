import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validation";
import { appendCommentToSheet } from "@/lib/google-sheets";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot tripped — pretend it worked so the bot doesn't learn anything.
  if (data.companyWebsite) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const post = await prisma.post.findUnique({ where: { id: data.postId }, select: { id: true, status: true, title: true } });
  if (!post || post.status !== "published") {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      body: data.body,
      status: "approved",
    },
  });

  await appendCommentToSheet({
    name: data.authorName,
    email: data.authorEmail,
    comment: data.body,
    postTitle: post.title,
    createdAt: comment.createdAt,
  });

  // deleteToken lets the commenter delete their own comment later (see
  // /api/comments/[id]) — the client stores it in localStorage. It's only
  // ever returned here, right after creation; the public comments query
  // never selects it.
  return NextResponse.json(
    {
      ok: true,
      id: comment.id,
      deleteToken: comment.deleteToken,
      authorName: comment.authorName,
      body: comment.body,
      createdAt: comment.createdAt,
    },
    { status: 201 }
  );
}
