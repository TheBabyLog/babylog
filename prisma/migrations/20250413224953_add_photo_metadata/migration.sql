/*
  Warnings:

  - Added the required column `takenAt` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takenOn` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "takenAt" TEXT NOT NULL,
ADD COLUMN     "takenOn" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Photo_takenAt_idx" ON "Photo"("takenAt");
