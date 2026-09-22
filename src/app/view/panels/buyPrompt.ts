import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions } from "../types";
import { Panel } from "./panel";

export class BuyPromptPanel extends Panel {
	private readonly itemInfo: TextRenderable;
	private readonly quantity: TextRenderable;
	private readonly total: TextRenderable;

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			width: "100%",
			height: "100%",
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 10,
			alignItems: "center",
			justifyContent: "center",
		});
		super(root);
		const box = new BoxRenderable(renderer, {
			width: 44,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["top", "right", "bottom", "left"],
			borderColor: theme.accent,
			flexDirection: "column",
			gap: 1,
		});
		box.add(
			new TextRenderable(renderer, {
				content: "Confirm Purchase",
				fg: theme.accent,
				selectable: false,
			}),
		);
		this.itemInfo = new TextRenderable(renderer, {
			content: "",
			fg: theme.fg,
			selectable: false,
		});
		this.quantity = new TextRenderable(renderer, {
			content: "",
			fg: theme.yellow,
			selectable: false,
		});
		this.total = new TextRenderable(renderer, {
			content: "",
			fg: theme.cyan,
			selectable: false,
		});
		const buttons = new BoxRenderable(renderer, {
			flexDirection: "row",
			justifyContent: "space-between",
		});
		buttons.add(
			new TextRenderable(renderer, {
				content: "[ Enter ] Confirm",
				fg: theme.green,
				selectable: false,
				onMouseDown: () => actions.confirmBuy(),
			}),
		);
		buttons.add(
			new TextRenderable(renderer, {
				content: "[ Esc ] Cancel",
				fg: theme.muted,
				selectable: false,
				onMouseDown: () => actions.closeBuyPrompt(),
			}),
		);
		box.add(this.itemInfo);
		box.add(this.quantity);
		box.add(this.total);
		box.add(buttons);
		this.root.add(box);
	}

	update(snapshot: AppSnapshot): void {
		if (!snapshot.buyPrompt) {
			this.root.visible = false;
			return;
		}
		const prompt = snapshot.buyPrompt;
		this.root.visible = true;
		this.itemInfo.content = `${prompt.item.item.name}\n${prompt.item.item.price} coins each · ${prompt.item.stock} in stock`;
		this.quantity.content = `Quantity: [ - ] ${prompt.quantity} [ + ] (← / → to adjust)`;
		this.total.content = `Total: ${prompt.item.item.price * prompt.quantity} coins (Balance: ${snapshot.coins} coins)`;
	}
}
