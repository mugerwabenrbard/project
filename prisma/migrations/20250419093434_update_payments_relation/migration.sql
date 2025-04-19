/*
  Warnings:

  - Added the required column `leadId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_clientId_fkey`;

-- DropIndex
DROP INDEX `Payments_clientId_fkey` ON `payments`;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `leadId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
