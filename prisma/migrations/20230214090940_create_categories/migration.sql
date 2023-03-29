-- CreateTable
CREATE TABLE `BookMemo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `isbn` INTEGER NOT NULL,
    `isbn13` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `start` INTEGER NULL,
    `end` INTEGER NULL,
    `keywords` VARCHAR(191) NULL,
    `field` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
