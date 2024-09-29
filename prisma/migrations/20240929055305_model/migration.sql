/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `Session` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seating` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "seating" AS ENUM ('seating');

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userUser_id_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userUser_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contactNumber" INTEGER NOT NULL,
ADD COLUMN     "seating" "seating" NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "gender" NOT NULL;
