import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import { isUsableItem } from "@/core/itemEffects";
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
				if (snapshot.page === "inventory") {
					const entry = snapshot.inventory[snapshot.selectedInventoryIndex];
					if (entry && isUsableItem(entry.item.id)) {
						actions.useInventoryItem(snapshot.selectedInventoryIndex);
					}
					return;
				}
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
		if (snapshot.page === "inventory") {
			this.title.content = "Inventory";
			const entry = snapshot.inventory[snapshot.selectedInventoryIndex];
			if (!entry) {
				this.detail.content =
					"Your bag is empty.\n\nUse s to visit Orpheus' Shop.";
				this.detail.fg = theme.muted;
				this.action.visible = false;
				this.art.visible = false;
				return;
			}
			const usable = isUsableItem(entry.item.id);
			this.detail.content = `${entry.quantity}x ${entry.item.name}\n\n${entry.item.description}\n\n${usable ? "Feed it to your companion." : "A keepsake — it can't be used."}`;
			this.detail.fg = usable ? theme.fg : theme.muted;
			this.action.content = usable
				? "[ Use selected item ]"
				: "[ No effect ]";
			this.action.fg = usable ? theme.accent : theme.muted;
			this.action.visible = true;
			if (entry.item.art) {
				this.art.content = entry.item.art;
				this.art.visible = true;
			} else {
				this.art.content = "";
				this.art.visible = false;
			}
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
