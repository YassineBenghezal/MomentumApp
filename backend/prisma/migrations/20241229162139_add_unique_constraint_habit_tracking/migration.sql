/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date,userId]` on the table `HabitTracking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HabitTracking_habitId_date_userId_key" ON "HabitTracking"("habitId", "date", "userId");
