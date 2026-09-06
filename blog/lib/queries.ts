import { prisma } from "@/lib/prisma";

function publishedWhere() {
  return {
    status: "published" as const,
    publishedAt: { lte: new Date() },
  };
}

const cardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  categories: { select: { category: { select: { name: true, slug: true } } } },
} as const;

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getLatestPosts(limit = 12) {
  return prisma.post.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getPostsByCategorySlug(slug: string) {
  return prisma.post.findMany({
    where: { ...publishedWhere(), categories: { some: { category: { slug } } } },
    orderBy: { publishedAt: "desc" },
    select: cardSelect,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, ...publishedWhere() },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      attachments: true,
      author: { select: { name: true } },
      comments: {
        where: { status: "approved" },
        orderBy: { createdAt: "asc" },
        // Never select authorEmail or deleteToken here — this data is sent
        // straight to every visitor's browser as page props.
        select: { id: true, authorName: true, body: true, createdAt: true },
      },
    },
  });
}

export async function getRelatedPosts(categoryIds: string[], excludePostId: string, limit = 3) {
  if (categoryIds.length === 0) return [];
  return prisma.post.findMany({
    where: {
      ...publishedWhere(),
      categories: { some: { categoryId: { in: categoryIds } } },
      id: { not: excludePostId },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}
