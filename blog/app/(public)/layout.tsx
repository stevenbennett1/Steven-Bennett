import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/queries";

// Applies to every public page: otherwise Next.js statically freezes pages
// with no dynamic inputs (the homepage, /resources, /about) from whatever
// the database looked like at build time — new posts/resources/categories
// would never show up without a fresh deploy.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </>
  );
}
