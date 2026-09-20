import {
	BoxRenderable,
	createCliRenderer,
	TextRenderable,
} from "@opentui/core";
import petModule from "../core/pet";
import { getAppInitState } from "../db/init";
import { getDailyShop } from "../core/shop";

export async function startApp() {
	const renderer = await createCliRenderer({
		exitOnCtrlC: true,
		backgroundColor: "#1131E9",
	});

	const { pet, user } = await getAppInitState();

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
			? `Hunger ${pet.hunger} | Happiness ${pet.happiness} | Energy ${pet.energy}`
			: "Press c to create your pet",
		fg: "#AEBBFF",
	});

	const instructions = new TextRenderable(renderer, {
		content: pet ? "s shop - q quit" : "c create - s shop - q quit",
		fg: "#AEBBFF",
	});

	const shopDisplay = new TextRenderable(renderer, {
		content:"",
		fg: "#DCE3FF"
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
				if (user)	{
					const shop = getDailyShop (user.secret);
					shopDisplay.content = shop
					    .map((entry) => `${entry.item.name} (${entry.stock}) -${entry.item.price}c`)
						.join("\n");
				}
				return;
			default:
				return;
		}
	});
}
