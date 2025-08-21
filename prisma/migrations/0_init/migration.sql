-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MERCADEO', 'REPRESENTANTE') NOT NULL DEFAULT 'REPRESENTANTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_token_key`(`token`),
    UNIQUE INDEX `Session_refreshToken_key`(`refreshToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fair` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NOT NULL,
    `standNumber` VARCHAR(191) NOT NULL,
    `areaM2` DOUBLE NOT NULL,
    `totalInvestment` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FairRepresentative` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,

    INDEX `FairRepresentative_fairId_idx`(`fairId`),
    INDEX `FairRepresentative_userId_idx`(`userId`),
    UNIQUE INDEX `FairRepresentative_fairId_userId_key`(`fairId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `otherProfile` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `companyNit` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `estimatedPotential` ENUM('BAJO', 'MEDIO', 'ALTO') NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Contact_createdById_idx`(`createdById`),
    INDEX `Contact_fairId_idx`(`fairId`),
    INDEX `Contact_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactProfile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `ContactProfile_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` VARCHAR(191) NOT NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `amount` ENUM('BAJA', 'MEDIO', 'ALTA', 'SUPERIOR') NOT NULL,

    UNIQUE INDEX `Sale_contactId_key`(`contactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParallelActivity` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `type` ENUM('CHARLA_TECNICA', 'RUEDA_DE_NEGOCIOS', 'OTRO') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `attendees` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ParallelActivity_fairId_idx`(`fairId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DafoAnalysis` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `type` ENUM('DEBILIDAD', 'AMENAZA', 'FORTALEZA', 'OPORTUNIDAD') NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    INDEX `DafoAnalysis_fairId_idx`(`fairId`),
    INDEX `DafoAnalysis_representativeId_idx`(`representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FairCompetitor` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `featuredProducts` VARCHAR(191) NOT NULL,
    `strengths` VARCHAR(191) NOT NULL,
    `weaknesses` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FairCompetitor_fairId_idx`(`fairId`),
    INDEX `FairCompetitor_representativeId_idx`(`representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tendency` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Tendency_fairId_idx`(`fairId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FairEvaluation` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FairEvaluation_representativeId_idx`(`representativeId`),
    UNIQUE INDEX `FairEvaluation_fairId_representativeId_key`(`fairId`, `representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FairAchievement` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FairAchievement_fairId_idx`(`fairId`),
    INDEX `FairAchievement_representativeId_idx`(`representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImprovementArea` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ImprovementArea_fairId_idx`(`fairId`),
    INDEX `ImprovementArea_representativeId_idx`(`representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FairEvidence` (
    `id` VARCHAR(191) NOT NULL,
    `fairId` VARCHAR(191) NOT NULL,
    `representativeId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    INDEX `FairEvidence_fairId_idx`(`fairId`),
    INDEX `FairEvidence_representativeId_idx`(`representativeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairRepresentative` ADD CONSTRAINT `FairRepresentative_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairRepresentative` ADD CONSTRAINT `FairRepresentative_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `ContactProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParallelActivity` ADD CONSTRAINT `ParallelActivity_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DafoAnalysis` ADD CONSTRAINT `DafoAnalysis_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DafoAnalysis` ADD CONSTRAINT `DafoAnalysis_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairCompetitor` ADD CONSTRAINT `FairCompetitor_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairCompetitor` ADD CONSTRAINT `FairCompetitor_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tendency` ADD CONSTRAINT `Tendency_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairEvaluation` ADD CONSTRAINT `FairEvaluation_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairEvaluation` ADD CONSTRAINT `FairEvaluation_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairAchievement` ADD CONSTRAINT `FairAchievement_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairAchievement` ADD CONSTRAINT `FairAchievement_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImprovementArea` ADD CONSTRAINT `ImprovementArea_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImprovementArea` ADD CONSTRAINT `ImprovementArea_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairEvidence` ADD CONSTRAINT `FairEvidence_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FairEvidence` ADD CONSTRAINT `FairEvidence_representativeId_fkey` FOREIGN KEY (`representativeId`) REFERENCES `FairRepresentative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

