import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public, unauthenticated — a commenter deletes their own comment by proving
// they hold the deleteToken they were given when they posted it (stored in
// their browser's localStorage). Not admin moderation; see
// /api/admin/comments/[id] for that.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token : null;

  if (!token) {
    return NextResponse.json({ error: "Missing delete token" }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({ where: { id }, select: { deleteToken: true } });
  if (!comment || comment.deleteToken !== token) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
