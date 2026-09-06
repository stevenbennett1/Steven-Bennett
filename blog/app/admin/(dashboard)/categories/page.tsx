import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <h1 className="tracking-tight text-2xl font-bold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-ink-soft">
        These are the topics readers can browse by — Books I Recommend, AI, Economics, and so on.
      </p>
      <div className="mt-6">
        <CategoriesManager initial={categories} />
      </div>
    </div>
  );
}
