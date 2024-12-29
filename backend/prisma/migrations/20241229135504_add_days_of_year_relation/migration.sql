/*
  Warnings:

  - You are about to drop the column `daysOfYear` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "daysOfYear";

-- CreateTable
CREATE TABLE "YearlyDay" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "YearlyDay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YearlyDay" ADD CONSTRAINT "YearlyDay_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
