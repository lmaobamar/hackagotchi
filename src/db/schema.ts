// a good start...

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const userProfile = sqliteTable("user_profile", {
	id: integer("id").primaryKey().default(1),
	secret: text("secret")
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	coins: integer("coins").notNull().default(0),
	totalPetsRaised: integer("total_pets_raised").notNull().default(0),
	lastLaunchedApp: text("last_launched_app"),
});

export const pet = sqliteTable("pet", {
	id: integer("id").primaryKey().default(1),
	userId: integer("user_id")
		.notNull()
		.default(1)
		.references(() => userProfile.id, { onDelete: "cascade" }),

	name: text("name").notNull().default("hackagotchi"),

	// stats
	hunger: integer("hunger").notNull().default(100),
	happiness: integer("happiness").notNull().default(50),
	energy: integer("energy").notNull().default(30),

	// is alive?
	isAlive: integer("is_alive", { mode: "boolean" }).notNull().default(true),

	// economy
	streakCount: integer("streak_count").notNull().default(0),
	lastStreakDate: text("last_streak_date"),
	previousStreak: integer("previous_streak").notNull().default(0),
	streakProtectedUntil: text("streak_protected_until"),
	decaySlowedUntil: text("decay_slowed_until"),

	lastInteractionAt: text("last_interaction_at")
		.notNull()
		.default(sql`(datetime('now'))`),

	// cosmetic
	petStyle: text("pet_style").notNull().default("sprout"),
});

export const inventory = sqliteTable(
	"inventory",
	{
		userId: integer("user_id")
			.notNull()
			.default(1)
			.references(() => userProfile.id, { onDelete: "cascade" }),
		itemId: text("item_id").notNull(),
		quantity: integer("quantity").notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.itemId] })],
);

export const shopPurchases = sqliteTable(
	"shop_purchases",
	{
		userId: integer("user_id")
			.notNull()
			.default(1)
			.references(() => userProfile.id, { onDelete: "cascade" }),
		epochDay: integer("epoch_day").notNull(),
		itemId: text("item_id").notNull(),
		quantity: integer("quantity").notNull().default(0),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.epochDay, table.itemId],
		}),
	],
);

export type UserProfile = InferSelectModel<typeof userProfile>;
export type InsertUserProfile = InferInsertModel<typeof userProfile>;
export type Pet = InferSelectModel<typeof pet>;
export type InsertPet = InferInsertModel<typeof pet>;
export type Inventory = InferSelectModel<typeof inventory>;
export type InsertInventory = InferInsertModel<typeof inventory>;
export type ShopPurchase = InferSelectModel<typeof shopPurchases>;
export type InsertShopPurchase = InferInsertModel<typeof shopPurchases>;
