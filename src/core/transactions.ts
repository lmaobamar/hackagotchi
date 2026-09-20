import type { UserProfile } from "@/db/schema";
import balance from "./balance";
import inventory from "./inventory";
import shop from "./shop";
import { InvalidItemIdInternalError, OutOfStockError } from "@/db/errors";

async function buyItem(
	user: UserProfile,
	itemId: string,
	quantity: number,
): Promise<void> {
	if (quantity <= 0) return;
	const currentShop = shop.getDailyShop(user.secret, user.id);
	const targetEntry = currentShop.find((entry) => entry.item.id === itemId);
	if (!targetEntry) throw new InvalidItemIdInternalError();
	const item = targetEntry.item;
	const stock = targetEntry.stock;

	if (stock < quantity) throw new OutOfStockError();

	balance.debitCoinsSync(item.price * quantity, user.id);
	shop.recordPurchase(user.id, item.id, quantity);
	await inventory.addItemToInventory(item.id, quantity);
}

export default { buyItem };
