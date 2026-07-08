/*
  Warnings:

  - You are about to drop the `FairEvidence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FairEvidence` DROP FOREIGN KEY `FairEvidence_fairId_fkey`;

-- DropForeignKey
ALTER TABLE `FairEvidence` DROP FOREIGN KEY `FairEvidence_representativeId_fkey`;

-- DropTable
DROP TABLE `FairEvidence`;
