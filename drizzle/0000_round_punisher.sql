CREATE TABLE `inventory` (
	`user_id` integer DEFAULT 1 NOT NULL,
	`item_id` text NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`user_id`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pet` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`user_id` integer DEFAULT 1 NOT NULL,
	`name` text NOT NULL,
	`hunger` integer DEFAULT 100 NOT NULL,
	`happiness` integer DEFAULT 50 NOT NULL,
	`energy` integer DEFAULT 30 NOT NULL,
	`is_alive` integer DEFAULT true NOT NULL,
	`streak_count` integer DEFAULT 0 NOT NULL,
	`last_streak_date` text,
	`last_interaction_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`secret` text NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	`total_pets_raised` integer DEFAULT 0 NOT NULL
);
