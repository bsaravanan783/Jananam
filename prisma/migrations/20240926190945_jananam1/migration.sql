/*
  Warnings:

  - Added the required column `bay_type` to the `Bay` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "bayType" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Bay" ADD COLUMN     "bay_type" "bayType" NOT NULL;
