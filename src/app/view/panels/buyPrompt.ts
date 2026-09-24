import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions, ViewportMode } from "../types";
import { Panel } from "./panel";

export class BuyPromptPanel extends Panel {
	private readonly itemInfo: TextRenderable;
	private readonly quantity: TextRenderable;
	private readonly total: TextRenderable;
	private readonly box: BoxRenderable;
	private readonly buttons: BoxRenderable;
	private readonly confirm: TextRenderable;
	private readonly cancel: TextRenderable;

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
		this.box = new BoxRenderable(renderer, {
			width: 44,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["top", "right", "bottom", "left"],
			borderColor: theme.accent,
			flexDirection: "column",
			gap: 1,
		});
		this.box.add(
			new TextRenderable(renderer, {
				content: "Confirm Purchase",
				fg: theme.accent,
				selectable: false,
			}),
		);
		this.itemInfo = new TextRenderable(renderer, {
			content: "",
			height: 2,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			fg: theme.fg,
			selectable: false,
		});
		this.quantity = new TextRenderable(renderer, {
			content: "",
			height: 1,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			fg: theme.yellow,
			selectable: false,
		});
		this.total = new TextRenderable(renderer, {
			content: "",
			height: 1,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			fg: theme.cyan,
			selectable: false,
		});
		this.buttons = new BoxRenderable(renderer, {
			height: 1,
			flexDirection: "row",
			justifyContent: "space-between",
		});
		this.confirm = new TextRenderable(renderer, {
			content: "[ Enter ] Confirm",
			fg: theme.green,
			selectable: false,
			onMouseDown: () => actions.confirmBuy(),
		});
		this.cancel = new TextRenderable(renderer, {
			content: "[ Esc ] Cancel",
			fg: theme.muted,
			selectable: false,
			onMouseDown: () => actions.closeBuyPrompt(),
		});
		this.buttons.add(this.confirm);
		this.buttons.add(this.cancel);
		this.box.add(this.itemInfo);
		this.box.add(this.quantity);
		this.box.add(this.total);
		this.box.add(this.buttons);
		this.root.add(this.box);
	}

	update(snapshot: AppSnapshot, width: number, mode: ViewportMode): void {
		if (!snapshot.buyPrompt || mode === "tiny") {
			this.root.visible = false;
			return;
		}
		const prompt = snapshot.buyPrompt;
		const compact = mode === "compact";
		this.box.width = Math.max(1, Math.min(44, width - 2));
		this.box.padding = compact ? 0 : 1;
		this.box.gap = compact ? 0 : 1;
		this.itemInfo.height = compact ? 1 : 2;
		this.buttons.justifyContent = compact ? "flex-start" : "space-between";
		this.confirm.content = compact ? "[Enter] Buy" : "[ Enter ] Confirm";
		this.cancel.content = compact ? " [Esc] Cancel" : "[ Esc ] Cancel";
		this.root.visible = true;
		this.itemInfo.content = compact
			? `${prompt.item.item.name} · ${prompt.item.item.price}c · ${prompt.item.stock} left`
			: `${prompt.item.item.name}\n${prompt.item.item.price} coins each · ${prompt.item.stock} in stock`;
		this.quantity.content = compact
			? `Qty: [-] ${prompt.quantity} [+]  ←→ adjust`
			: `Quantity: [ - ] ${prompt.quantity} [ + ]`;
		this.total.content = compact
			? `Total: ${prompt.item.item.price * prompt.quantity}c · Balance: ${snapshot.coins}c`
			: `Total: ${prompt.item.item.price * prompt.quantity} coins (Balance: ${snapshot.coins} coins)`;
	}
}
