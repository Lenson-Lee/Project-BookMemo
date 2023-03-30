/*
  Warnings:

  - Added the required column `displayName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `displayName` VARCHAR(191) NOT NULL;
