/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sess` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sid]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "sess",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");
