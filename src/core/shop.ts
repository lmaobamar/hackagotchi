import { createPRNG, getEpochDay } from "../helpers/prng";
import { ITEMS, type Item } from "./items";

export interface ShopEntry {
	item: Item;
	stock: number;
}

export function getDailyShop(userSecret: string): ShopEntry[] {
	const rand = createPRNG(getEpochDay(), userSecret);

	const shuffled = [...ITEMS];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		const temp = shuffled[i];
		shuffled[i] = shuffled[j] as Item;
		shuffled[j] = temp as Item;
	}

	const chosen = shuffled.slice(0, 3);

	return chosen.map((item) => ({
		item,
		stock: Math.floor(rand() * 5) + 1,
	}));
}
