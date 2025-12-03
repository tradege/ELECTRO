CREATE TABLE `gameResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`choice` enum('tree','leaf') NOT NULL,
	`result` enum('tree','leaf') NOT NULL,
	`isWin` tinyint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gameResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`packageType` enum('single','triple') NOT NULL,
	`totalAttempts` int NOT NULL,
	`attemptsUsed` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`amountPaid` int NOT NULL,
	`status` enum('active','won','lost','expired') NOT NULL DEFAULT 'active',
	`prizeCode` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gameSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prizeCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`status` enum('active','redeemed','expired') NOT NULL DEFAULT 'active',
	`redeemedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prizeCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `prizeCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `gameResults` ADD CONSTRAINT `gameResults_sessionId_gameSessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gameResults` ADD CONSTRAINT `gameResults_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gameResults` ADD CONSTRAINT `gameResults_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gameSessions` ADD CONSTRAINT `gameSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gameSessions` ADD CONSTRAINT `gameSessions_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prizeCodes` ADD CONSTRAINT `prizeCodes_sessionId_gameSessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prizeCodes` ADD CONSTRAINT `prizeCodes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prizeCodes` ADD CONSTRAINT `prizeCodes_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;