import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { shopPurchases } from "@/db/schema";
import { createPRNG, getEpochDay } from "@/helpers/prng";
import { ITEMS, type Item } from "./items";

export interface ShopEntry {
	item: Item;
	stock: number;
	maxStock: number;
}

function getDailyShop(userSecret: string, userId: number = 1): ShopEntry[] {
	const epochDay = getEpochDay();
	const rand = createPRNG(epochDay, userSecret);

	const shuffled = [...ITEMS];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		const temp = shuffled[i];
		shuffled[i] = shuffled[j] as Item;
		shuffled[j] = temp as Item;
	}

	const chosen = shuffled.slice(0, 3);
	const generated = chosen.map((item) => ({
		item,
		maxStock: Math.floor(rand() * 5) + 1,
	}));

	const recordedPurchases = db
		.select()
		.from(shopPurchases)
		.where(
			and(
				eq(shopPurchases.userId, userId),
				eq(shopPurchases.epochDay, epochDay),
			),
		)
		.all();

	const purchasedMap = new Map<string, number>();
	for (const p of recordedPurchases) {
		purchasedMap.set(p.itemId, p.quantity);
	}

	return generated.map(({ item, maxStock }) => {
		const bought = purchasedMap.get(item.id) ?? 0;
		return {
			item,
			maxStock,
			stock: Math.max(0, maxStock - bought),
		};
	});
}

function recordPurchase(
	userId: number,
	itemId: string,
	quantity: number,
): void {
	const epochDay = getEpochDay();
	db.insert(shopPurchases)
		.values({
			userId,
			epochDay,
			itemId,
			quantity,
		})
		.onConflictDoUpdate({
			target: [
				shopPurchases.userId,
				shopPurchases.epochDay,
				shopPurchases.itemId,
			],
			set: {
				quantity: sql`${shopPurchases.quantity} + ${quantity}`,
			},
		})
		.run();
}

export default { getDailyShop, recordPurchase };
