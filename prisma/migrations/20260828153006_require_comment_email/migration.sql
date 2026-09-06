/*
  Warnings:

  - Made the column `authorEmail` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "authorEmail" SET NOT NULL;
