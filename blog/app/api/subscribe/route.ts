import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subscribeSchema } from "@/lib/validation";
import { appendSubscriberToSheet } from "@/lib/google-sheets";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot tripped — pretend it worked so the bot doesn't learn anything.
  if (data.companyWebsite) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const email = data.email.toLowerCase().trim();
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    // Not an error — just let them know they're already on the list.
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const subscriber = await prisma.subscriber.create({
    data: { email, source: data.source || null },
  });

  await appendSubscriberToSheet({ email: subscriber.email, source: subscriber.source, createdAt: subscriber.createdAt });

  return NextResponse.json({ ok: true }, { status: 201 });
}
