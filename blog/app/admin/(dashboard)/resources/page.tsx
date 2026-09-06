import { prisma } from "@/lib/prisma";
import ResourcesManager from "@/components/admin/ResourcesManager";

export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Resources</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Books, courses, magazines, or tools you want to recommend on the public Resources page.
      </p>
      <div className="mt-6">
        <ResourcesManager initial={resources} />
      </div>
    </div>
  );
}
