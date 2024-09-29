/*
  Warnings:

  - Changed the type of `seating` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "seating",
ADD COLUMN     "seating" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "seating";
