/*
  Warnings:

  - The values [daily,weekly,monthly] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `customDays` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `days` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HabitTracking` table. All the data in the column will be lost.
  - You are about to drop the column `lastTrackedAt` on the `HabitTracking` table. All the data in the column will be lost.
  - Added the required column `completionMode` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completed` to the `HabitTracking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompletionMode" AS ENUM ('BINARY', 'NUMERIC');

-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM');
ALTER TABLE "Habit" ALTER COLUMN "frequency" TYPE "Frequency_new" USING ("frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "Frequency_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- DropForeignKey
ALTER TABLE "HabitTracking" DROP CONSTRAINT "HabitTracking_userId_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "createdAt",
DROP COLUMN "customDays",
DROP COLUMN "days",
DROP COLUMN "updatedAt",
ADD COLUMN     "completionMode" "CompletionMode" NOT NULL,
ADD COLUMN     "daysOfMonth" TEXT[],
ADD COLUMN     "daysOfWeek" TEXT[],
ADD COLUMN     "daysOfYear" JSONB,
ADD COLUMN     "period" TEXT,
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "category" DROP DEFAULT;

-- AlterTable
ALTER TABLE "HabitTracking" DROP COLUMN "createdAt",
DROP COLUMN "lastTrackedAt",
ADD COLUMN     "completed" BOOLEAN NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTracking" ADD CONSTRAINT "HabitTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
