import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { defaultCategories } from "../lib/site-config";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "change-me-now";
  const name = process.env.ADMIN_NAME || "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`Admin user ready: ${user.email}`);

  for (const category of defaultCategories) {
    const slug = slugify(category.name, { lower: true, strict: true });
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: category.name, slug, description: category.description },
    });
  }
  console.log(`Seeded ${defaultCategories.length} categories.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
