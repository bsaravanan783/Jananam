/*
  Warnings:

  - You are about to drop the column `user_id` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_user_id_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "user_id",
ADD COLUMN     "sess" JSONB,
ADD COLUMN     "userUser_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userUser_id_fkey" FOREIGN KEY ("userUser_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
