/*
  Warnings:

  - You are about to drop the column `author` on the `BookMemo` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `BookMemo` table. All the data in the column will be lost.
  - Added the required column `auth` to the `BookMemo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BookMemo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BookMemo` DROP COLUMN `author`,
    DROP COLUMN `uid`,
    ADD COLUMN `auth` VARCHAR(191) NOT NULL,
    ADD COLUMN `content` VARCHAR(191) NULL,
    ADD COLUMN `cover` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `score` INTEGER NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_uid_key`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookMemo` ADD CONSTRAINT `BookMemo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
