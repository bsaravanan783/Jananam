/*
  Warnings:

  - Added the required column `transportNeed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tranport" AS ENUM ('NEEDED', 'NOTNEEDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "transportNeed" "tranport" NOT NULL;
