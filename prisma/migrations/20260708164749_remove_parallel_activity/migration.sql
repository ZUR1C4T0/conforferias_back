/*
  Warnings:

  - You are about to drop the `ParallelActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ParallelActivity` DROP FOREIGN KEY `ParallelActivity_fairId_fkey`;

-- DropTable
DROP TABLE `ParallelActivity`;
