/*
  Warnings:

  - You are about to drop the `YearlyDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "YearlyDay" DROP CONSTRAINT "YearlyDay_habitId_fkey";

-- DropTable
DROP TABLE "YearlyDay";

-- CreateTable
CREATE TABLE "DaysOfYear" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "DaysOfYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DaysOfYear" ADD CONSTRAINT "DaysOfYear_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
