/*
  Warnings:

  - Changed the type of `transportNeed` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "transportNeed",
ADD COLUMN     "transportNeed" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "tranport";
