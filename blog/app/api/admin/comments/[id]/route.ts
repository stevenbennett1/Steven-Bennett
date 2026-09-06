import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const status = body?.status;
  if (status !== "approved" && status !== "pending") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const comment = await prisma.comment.update({ where: { id }, data: { status } });
  return NextResponse.json(comment);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
