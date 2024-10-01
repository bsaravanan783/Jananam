/*
  Warnings:

  - The values [MALE_1,MALE_2,FEMALE_1,FEMALE_2] on the enum `bayType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "bayType_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "Bay" ALTER COLUMN "bay_name" TYPE "bayType_new" USING ("bay_name"::text::"bayType_new");
ALTER TYPE "bayType" RENAME TO "bayType_old";
ALTER TYPE "bayType_new" RENAME TO "bayType";
DROP TYPE "bayType_old";
COMMIT;
