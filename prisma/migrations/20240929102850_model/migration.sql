/*
  Warnings:

  - Changed the type of `seating` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "seating" AS ENUM ('SEATING');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "contactNumber" SET DATA TYPE TEXT,
DROP COLUMN "seating",
ADD COLUMN     "seating" "seating" NOT NULL;
