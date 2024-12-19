/*
  Warnings:

  - The `status` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('EN_COURS', 'COMPLETÉ', 'ANNULÉ');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'EN_COURS';
