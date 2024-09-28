/*
  Warnings:

  - Changed the type of `ticket_status` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ticketStatus" AS ENUM ('BLOCKED', 'PURCHASED', 'CANCELED');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "ticket_status",
ADD COLUMN     "ticket_status" "ticketStatus" NOT NULL;
