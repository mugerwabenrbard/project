/*
  Warnings:

  - You are about to drop the column `clientId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `leadId` to the `Stages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `Clients_currentStageId_fkey`;

-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `Clients_leadId_fkey`;

-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `Clients_userId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `Documents_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `stages` DROP FOREIGN KEY `Stages_clientId_fkey`;

-- DropIndex
DROP INDEX `Documents_clientId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `Notifications_clientId_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `Stages_clientId_fkey` ON `stages`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `clientId`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `clientId`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `clientId`;

-- AlterTable
ALTER TABLE `stages` DROP COLUMN `clientId`,
    ADD COLUMN `leadId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` VARCHAR(50) NOT NULL DEFAULT 'lead';

-- DropTable
DROP TABLE `clients`;

-- AddForeignKey
ALTER TABLE `Stages` ADD CONSTRAINT `Stages_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
