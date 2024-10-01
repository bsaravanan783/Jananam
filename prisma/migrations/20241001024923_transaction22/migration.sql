-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bay_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bay_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bay_id_fkey" FOREIGN KEY ("bay_id") REFERENCES "Bay"("bay_id") ON DELETE SET NULL ON UPDATE CASCADE;
