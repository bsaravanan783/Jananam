/*
  Warnings:

  - You are about to drop the column `no_of_tickets` on the `Ticket` table. All the data in the column will be lost.
  - Changed the type of `transaction_status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "transactionStatus" AS ENUM ('COMPLETED', 'PROCESSED', 'CANCELED');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "no_of_tickets";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transaction_status",
ADD COLUMN     "transaction_status" "transactionStatus" NOT NULL;
