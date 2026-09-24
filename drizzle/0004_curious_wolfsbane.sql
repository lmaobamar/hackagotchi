PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pet` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`user_id` integer DEFAULT 1 NOT NULL,
	`name` text DEFAULT 'hackagotchi' NOT NULL,
	`hunger` integer DEFAULT 100 NOT NULL,
	`happiness` integer DEFAULT 50 NOT NULL,
	`energy` integer DEFAULT 30 NOT NULL,
	`is_alive` integer DEFAULT true NOT NULL,
	`streak_count` integer DEFAULT 0 NOT NULL,
	`last_streak_date` text,
	`previous_streak` integer DEFAULT 0 NOT NULL,
	`streak_protected_until` text,
	`decay_slowed_until` text,
	`last_interaction_at` text DEFAULT (datetime('now')) NOT NULL,
	`pet_style` text DEFAULT 'sprout' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_pet`("id", "user_id", "name", "hunger", "happiness", "energy", "is_alive", "streak_count", "last_streak_date", "previous_streak", "streak_protected_until", "decay_slowed_until", "last_interaction_at", "pet_style") SELECT "id", "user_id", "name", "hunger", "happiness", "energy", "is_alive", "streak_count", "last_streak_date", "previous_streak", "streak_protected_until", "decay_slowed_until", "last_interaction_at", "pet_style" FROM `pet`;--> statement-breakpoint
DROP TABLE `pet`;--> statement-breakpoint
ALTER TABLE `__new_pet` RENAME TO `pet`;--> statement-breakpoint
PRAGMA foreign_keys=ON;