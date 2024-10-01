/*
  Warnings:

  - Added the required column `bay_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bay_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "Bay"("bay_id") ON DELETE RESTRICT ON UPDATE CASCADE;
