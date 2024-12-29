/*
  Warnings:

  - The values [SPORTS,FINANCES,SANTÉ,AUTRE] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 'OTHER');
ALTER TABLE "Habit" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Habit" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TABLE "Task" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
ALTER TABLE "Habit" ALTER COLUMN "category" SET DEFAULT 'OTHER';
ALTER TABLE "Task" ALTER COLUMN "category" SET DEFAULT 'OTHER';
COMMIT;

-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "category" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "category" SET DEFAULT 'OTHER';
