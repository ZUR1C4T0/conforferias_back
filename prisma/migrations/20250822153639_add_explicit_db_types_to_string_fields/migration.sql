-- AlterTable
ALTER TABLE `ContactProfile` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `DafoAnalysis` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Fair` MODIFY `logoUrl` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `FairAchievement` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `FairCompetitor` MODIFY `featuredProducts` TEXT NOT NULL,
    MODIFY `strengths` TEXT NOT NULL,
    MODIFY `weaknesses` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `FairEvaluation` MODIFY `explanation` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `FairEvidence` MODIFY `url` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `ImprovementArea` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `ParallelActivity` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Tendency` MODIFY `details` TEXT NULL;
