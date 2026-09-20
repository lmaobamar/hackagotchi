import {
	BoxRenderable,
	createCliRenderer,
	TextRenderable,
} from "@opentui/core";
import petModule from "@/core/pet";
import { getAppInitState } from "@/db/init";
import shopModule from "@/core/shop";
import balanceModule from "@/core/balance";
import invModule from "@/core/inventory";
import { InsufficientFundsError } from "@/db/errors";
import transactions from "@/core/transactions";

export async function startApp() {
	const renderer = await createCliRenderer({
		exitOnCtrlC: true,
		backgroundColor: "#1131E9",
	});

	let currentShop: ReturnType<typeof shopModule.getDailyShop> = [];

	const { pet, user } = await getAppInitState();

	if (pet) {
		await petModule.updateStreak(pet.userId);
	}

	const panel = new BoxRenderable(renderer, {
		width: 47,
		height: 15,
		backgroundColor: "#1131E9",
		alignItems: "center",
		justifyContent: "center",
	});

	const content = new BoxRenderable(renderer, {
		width: 40,
		height: 13,
		backgroundColor: "#2947F0",
		padding: 1,
		flexDirection: "column",
		gap: 1,
		alignItems: "center",
	});

	const title = new TextRenderable(renderer, {
		content: pet ? pet.name : "No pet yet!",
		fg: "#DCE3FF",
	});

	const stats = new TextRenderable(renderer, {
		content: pet
			? `Hunger ${pet.hunger} | Happiness ${pet.happiness} | Energy ${pet.energy} | Streak ${pet.streakCount}`
			: "Press c to create your pet",
		fg: "#AEBBFF",
	});

	const instructions = new TextRenderable(renderer, {
		content: pet ? "s shop - q quit" : "c create - s shop - q quit",
		fg: "#AEBBFF",
	});

	const shopDisplay = new TextRenderable(renderer, {
		content: "",
		fg: "#DCE3FF",
	});

	content.add(title);
	content.add(stats);
	content.add(instructions);
	content.add(shopDisplay);
	panel.add(content);
	renderer.root.add(panel);

	renderer.keyInput.on("keypress", async (key) => {
		switch (key.name) {
			case "q":
				renderer.destroy();
				return;
			case "c":
				if (!pet) {
					await petModule.createPet("Orpheus Jr");
					title.content = "Orpheus Jr";
					stats.content = " Hunger 100 | Happiness 50 | Energy 30";
					instructions.content = "s shop - q quit";
				}
				return;
			case "s":
				if (user) {
					currentShop = shopModule.getDailyShop(user.secret);
					shopDisplay.content = currentShop
						.map(
							(entry, i) =>
								`${i + 1}. ${entry.item.name} : ${entry.item.price}c (${entry.stock} in stock)`,
						)
						.join("\n");
				}
				return;
			case "t":
				if (user) transactions.buyItem(user, "streak_reviver", 1);
				return;
			case "\\":
				if (process.env.NODE_ENV !== "production") {
					renderer.console.toggle();
				}
				return;
			case "1":
			case "2":
			case "3":
				const index = Number(key.name) - 1;
				const entry = currentShop[index];
				if (entry && user) {
					try {
						balanceModule.debitCoinsSync(entry.item.price, user.id);
						invModule.addItemToInventory(entry.item.id, 1);
						shopDisplay.content = `Bought ${entry.item.name}!`;
					} catch (e) {
						if (e instanceof InsufficientFundsError) {
							shopDisplay.content = "Not enough coins!";
						} else {
							shopDisplay.content = "Something went wrong";
						}
					}
				}
				return;
			default:
				return;
		}
	});
}
