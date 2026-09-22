import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions, ViewportMode } from "../types";
import { Panel } from "./panel";

export class DetailsRail extends Panel {
	private readonly title: TextRenderable;
	private readonly detail: TextRenderable;
	private readonly action: TextRenderable;
	private readonly art: TextRenderable;
	private snapshot: AppSnapshot | null = null;

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			width: 30,
			flexShrink: 0,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["left"],
			borderColor: theme.border,
			flexDirection: "column",
			gap: 1,
		});
		super(root);
		this.title = new TextRenderable(renderer, {
			content: "Details",
			fg: theme.muted,
			selectable: false,
		});
		this.root.add(this.title);
		this.detail = new TextRenderable(renderer, {
			content: "",
			fg: theme.fg,
			wrapMode: "word",
			selectable: false,
		});
		this.root.add(this.detail);
		this.action = new TextRenderable(renderer, {
			content: "",
			fg: theme.accent,
			selectable: false,
			onMouseDown: () => {
				const snapshot = this.snapshot;
				if (!snapshot) return;
				const selected = snapshot.shop[snapshot.selectedShopIndex];
				if (
					selected &&
					selected.stock > 0 &&
					snapshot.coins >= selected.item.price
				) {
					actions.openBuyPrompt();
				}
			},
		});
		this.art = new TextRenderable(renderer, {
			content: "",
			fg: theme.yellow,
			selectable: false,
		});
		this.root.add(this.action);
		this.root.add(this.art);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		this.snapshot = snapshot;
		this.root.visible = mode === "wide";
		const selected = snapshot.shop[snapshot.selectedShopIndex];
		const canAfford = Boolean(selected && snapshot.coins >= selected.item.price);
		const available = Boolean(selected && selected.stock > 0);
		if (snapshot.page === "home") {
			this.title.content = "Habitat";
			this.detail.content = snapshot.pet
				? `${snapshot.pet.name}\n\n${snapshot.pet.streakCount} day streak\n${snapshot.pet.isAlive ? "Pet ok" : "Pet needs care"}\n\nAvailable actions\nOpen Shop for supplies\nPress s to browse`
				: "No companion has moved in yet.\n\nAvailable actions\nPress c to hatch a companion\nPress s to browse supplies";
			this.detail.fg = snapshot.pet?.isAlive
				? theme.fg
				: snapshot.pet
					? theme.red
					: theme.yellow;
			this.action.visible = false;
			this.art.visible = false;
			return;
		}
		this.title.content = "Selected item";
		this.detail.content = selected
			? `${selected.item.name}\n\n${selected.item.description}\n\nPrice: ${selected.item.price} coins\n${available ? (canAfford ? "You can afford this." : "You need more coins.") : "Sold out."}`
			: "Choose an item to inspect.";
		this.detail.fg = !available
			? theme.red
			: canAfford
				? theme.fg
				: theme.yellow;
		this.action.content = available
			? canAfford
				? "[ Buy selected item ]"
				: "[ Not enough coins ]"
			: "[ Sold out ]";
		this.action.fg = available && canAfford ? theme.accent : theme.muted;
		this.action.visible = true;
		if (selected?.item.art) {
			this.art.content = selected.item.art;
			this.art.visible = true;
			return;
		}
		this.art.content = "";
		this.art.visible = false;
	}
}
