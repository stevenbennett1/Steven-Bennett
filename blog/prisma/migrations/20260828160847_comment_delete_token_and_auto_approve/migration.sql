-- AlterTable: add as nullable first, backfill, then enforce NOT NULL
ALTER TABLE "Comment" ADD COLUMN     "deleteToken" TEXT;

UPDATE "Comment" SET "deleteToken" = gen_random_uuid()::text WHERE "deleteToken" IS NULL;

ALTER TABLE "Comment" ALTER COLUMN "deleteToken" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'approved';
