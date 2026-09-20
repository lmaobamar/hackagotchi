import type { UserProfile } from "@/db/schema";
import balance from "./balance";
import inventory from "./inventory";
import shop from "./shop";
import { InvalidItemIdInternalError, OutOfStockError } from "@/db/errors";

function buyItem(user: UserProfile, itemId: string, quantity: number): void {
	// first let's get current shop...
	const currentShop = shop.getDailyShop(user.secret);
	const targetEntry = currentShop.find((entry) => entry.item.id === itemId);
	if (!targetEntry) throw new InvalidItemIdInternalError();
	const item = targetEntry.item;
	const stock = targetEntry.stock;

	// ok, now check stock
	if (stock <= 0) throw new OutOfStockError();

	// ok, now try to debit
	balance.debitCoinsSync(item.price, user.id); // this will throw if it goes wrong so no try/catch
	inventory.addItemToInventory(item.id, quantity);
	// TODO: item's stock will go down
	return;
}

export default { buyItem };
