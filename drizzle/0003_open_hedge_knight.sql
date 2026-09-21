ALTER TABLE `pet` ADD `previous_streak` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `pet` ADD `decay_slowed_until` text;