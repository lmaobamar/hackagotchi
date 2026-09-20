CREATE TABLE `shop_purchases` (
	`user_id` integer DEFAULT 1 NOT NULL,
	`epoch_day` integer NOT NULL,
	`item_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `epoch_day`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
