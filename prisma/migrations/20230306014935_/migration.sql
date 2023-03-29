/*
  Warnings:

  - You are about to drop the column `content` on the `BookMemo` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `BookMemo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `MemoList_userId_fkey` ON `MemoList`;

-- AlterTable
ALTER TABLE `BookMemo` DROP COLUMN `content`,
    DROP COLUMN `keywords`;
