/*
  Warnings:

  - Added the required column `uid` to the `BookMemo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BookMemo` ADD COLUMN `uid` VARCHAR(191) NOT NULL;
