/*
  Warnings:

  - You are about to drop the column `reminderTime` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SPORTS', 'FINANCES', 'SANTÉ', 'AUTRE');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "reminderTime",
DROP COLUMN "status",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'AUTRE',
ADD COLUMN     "customDays" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
ADD COLUMN     "days" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "occurrences" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "frequency" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'AUTRE';

-- CreateTable
CREATE TABLE "HabitTracking" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lastTrackedAt" TIMESTAMP(3),
    "habitId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitTracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitTracking" ADD CONSTRAINT "HabitTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTracking" ADD CONSTRAINT "HabitTracking_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
