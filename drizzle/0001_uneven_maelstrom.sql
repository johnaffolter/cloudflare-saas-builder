CREATE TABLE `view` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`displayName` text NOT NULL,
	`description` text,
	`sqlDefinition` text NOT NULL,
	`semanticMetadata` text,
	`status` text DEFAULT 'draft',
	`createdBy` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user';