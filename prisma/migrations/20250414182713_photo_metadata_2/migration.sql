/*
  Warnings:

  - You are about to drop the column `notes` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `takenAt` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `takenOn` on the `Photo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Photo_takenAt_idx";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "notes",
DROP COLUMN "takenAt",
DROP COLUMN "takenOn";
