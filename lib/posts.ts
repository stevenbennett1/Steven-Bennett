import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import type { PostInput } from "@/lib/validation";

export async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title, { lower: true, strict: true }) || "post";
  let slug = base;
  let attempt = 1;
  for (;;) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
  return slug;
}

export class ScheduleError extends Error {}

export function resolvePublishedAt(
  status: PostInput["status"],
  publishedAt?: string | null
): Date | null {
  if (status === "published") {
    return publishedAt ? new Date(publishedAt) : new Date();
  }
  if (status === "scheduled") {
    if (!publishedAt) throw new ScheduleError("A scheduled post needs a publish date");
    return new Date(publishedAt);
  }
  return null;
}

export async function resolveTagIds(tagNames: string[] = []) {
  const ids: string[] = [];
  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const slug = slugify(name, { lower: true, strict: true });
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    ids.push(tag.id);
  }
  return ids;
}

export const postListInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  attachments: true,
  author: { select: { name: true, email: true } },
  _count: { select: { comments: { where: { status: "approved" } } } },
} as const;
