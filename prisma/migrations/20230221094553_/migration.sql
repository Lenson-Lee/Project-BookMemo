/*
  Warnings:

  - You are about to drop the `WishList` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `score` on table `BookMemo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `BookMemo` MODIFY `score` INTEGER NOT NULL;

-- DropTable
DROP TABLE `WishList`;
