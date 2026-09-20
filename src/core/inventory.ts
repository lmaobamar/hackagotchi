import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { inventory } from "@/db/schema";

async function addItemToInventory(
	itemId: string,
	quantity: number,
): Promise<void> {
	await db
		.insert(inventory)
		.values({
			userId: 1,
			itemId: itemId,
			quantity: quantity,
		})
		.onConflictDoUpdate({
			target: [inventory.userId, inventory.itemId],
			set: {
				quantity: sql`${inventory.quantity} + ${quantity}`,
			},
		});
}

async function getInventoryItem(itemId: string, userId: number = 1) {
	const [row] = await db
	    .select()
		.from(inventory)
		.where(and(eq(inventory.userId, userId), eq(inventory.itemId, itemId)));
	return row ?? null;	
}

async function removeItemFromInventory(itemId: string, userId: number = 1): Promise<void> {
	await db
	    .update(inventory)
		.set({ quantity: sql`${inventory.quantity} - 1` })
		.where(and(eq(inventory.userId, userId), eq(inventory.itemId, itemId), gte(inventory.quantity, 1)));
}

export default { addItemToInventory, getInventoryItem, removeItemFromInventory };
