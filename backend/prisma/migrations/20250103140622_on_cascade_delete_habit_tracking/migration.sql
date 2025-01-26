-- DropForeignKey
ALTER TABLE "HabitTracking" DROP CONSTRAINT "HabitTracking_habitId_fkey";

-- AddForeignKey
ALTER TABLE "HabitTracking" ADD CONSTRAINT "HabitTracking_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
