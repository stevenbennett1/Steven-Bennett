import { prisma } from "@/lib/prisma";
import SubscribersManager from "@/components/admin/SubscribersManager";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Subscribers</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Everyone who's signed up from the site. Also syncs to Google Sheets if you've set that up (see SETUP.md).
      </p>
      <div className="mt-6">
        <SubscribersManager initial={subscribers} />
      </div>
    </div>
  );
}
