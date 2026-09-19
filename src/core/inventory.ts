import { db } from "@/db";
import { inventory } from "@/db/schema";
import { sql } from "drizzle-orm";

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

export default { addItemToInventory };
