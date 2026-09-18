// a good start...
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const pet = sqliteTable("pet", {
	id: integer("id").primaryKey().default(1),
	name: text("name").notNull(),

	// stats
	hunger: integer("hunger").notNull().default(100),
	happiness: integer("happiness").notNull().default(50),
	energy: integer("energy").notNull().default(30),

	// is alive?
	isAlive: integer("is_alive", { mode: "boolean" }).notNull().default(true),

	// economy
	coins: integer("coins").notNull().default(0),
	streakCount: integer("streak_count").notNull().default(0),
	lastStreakDate: text("last_streak_date"),

	lastInteractionAt: text("last_interaction_at")
		.notNull()
		.default(sql`(datetime('now'))`),
});

export const inventory = sqliteTable("inventory", {
	itemId: text("item_id").primaryKey(),
	quantity: integer("quantity").notNull(),
});
