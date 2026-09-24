import { BorderChars, BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import shopArt from "@/art/shopArt";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions } from "../types";
import { Panel } from "./panel";

interface CounterSlot {
	icon: TextRenderable;
	label: TextRenderable;
	price: TextRenderable;
	front: BoxRenderable;
}

type ShopSceneTier = "full" | "medium" | "tiny";

export class ShopCounter extends Panel {
	private readonly slots: CounterSlot[];
	private readonly surface: BoxRenderable;
	private readonly front: BoxRenderable;

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			width: "100%",
			flexShrink: 0,
			flexDirection: "column",
			paddingRight: 1,
			paddingBottom: 1,
		});
		super(root);
		root.add(new BoxRenderable(renderer, {
			position: "absolute",
			left: 1,
			top: 1,
			right: 0,
			bottom: 0,
			backgroundColor: theme.chrome,
		}));
		this.surface = new BoxRenderable(renderer, {
			width: "100%",
			height: 7,
			flexShrink: 0,
			border: true,
			customBorderChars: { ...BorderChars.single, bottomLeft: "├", bottomRight: "┤" },
			borderColor: theme.counterEdge,
			backgroundColor: theme.counter,
			flexDirection: "row",
		});
		this.front = new BoxRenderable(renderer, {
			width: "100%",
			height: 4,
			flexShrink: 0,
			border: ["left", "right", "bottom"],
			borderColor: theme.counterEdge,
			backgroundColor: theme.chrome,
			flexDirection: "row",
		});
		this.slots = Array.from({ length: 3 }, (_, index) => {
			const select = () => actions.selectShop(index);
			const stand = new BoxRenderable(renderer, {
				width: 0,
				minWidth: 0,
				flexGrow: 1,
				alignItems: "center",
				justifyContent: "center",
				onMouseDown: select,
			});
			const icon = new TextRenderable(renderer, {
				width: 9,
				height: 5,
				wrapMode: "none",
				fg: theme.yellow,
				selectable: false,
			});
			stand.add(icon);
			this.surface.add(stand);
			const plaque = new BoxRenderable(renderer, {
				width: 0,
				minWidth: 0,
				flexGrow: 1,
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				onMouseDown: select,
			});
			const label = new TextRenderable(renderer, {
				content: "",
				height: 1,
				maxWidth: "100%",
				wrapMode: "none",
				truncate: true,
				fg: theme.fg,
				selectable: false,
			});
			const price = new TextRenderable(renderer, {
				content: "",
				height: 1,
				maxWidth: "100%",
				wrapMode: "none",
				truncate: true,
				fg: theme.muted,
				selectable: false,
			});
			plaque.add(label);
			plaque.add(price);
			this.front.add(plaque);
			return { icon, label, price, front: plaque };
		});
		root.add(this.surface);
		root.add(this.front);
	}

	update(snapshot: AppSnapshot, tier: ShopSceneTier): void {
		this.surface.height = tier === "full" ? 7 : tier === "medium" ? 4 : 3;
		this.front.height = tier === "full" ? 4 : tier === "medium" ? 3 : 2;
		this.root.paddingRight = tier === "tiny" ? 0 : 1;
		this.root.paddingBottom = tier === "tiny" ? 0 : 1;
		for (const [index, slot] of this.slots.entries()) {
			const entry = snapshot.shop[index];
			const selected = index === snapshot.selectedShopIndex;
			const inStock = Boolean(entry && entry.stock > 0);
			slot.icon.content = entry
				? (tier === "full" ? shopArt.byItemId : tier === "medium" ? shopArt.compactByItemId : shopArt.minimalByItemId)[entry.item.id] ?? ""
				: "";
			slot.icon.width = tier === "full" ? 9 : tier === "medium" ? 5 : 1;
			slot.icon.height = tier === "full" ? 5 : tier === "medium" ? 2 : 1;
			slot.icon.visible = true;
			slot.icon.fg = !inStock ? theme.muted : selected ? theme.accent : theme.yellow;
			slot.label.content = entry?.item.name ?? "";
			slot.label.fg = selected ? theme.accent : theme.fg;
			slot.price.content = entry
				? tier === "tiny"
					? `${entry.item.price}c ${inStock ? `${entry.stock}` : "out"}`
					: `${index + 1} · ${entry.item.price}c · ${inStock ? `${entry.stock} left` : "sold out"}`
				: "";
			slot.price.fg = inStock ? theme.muted : theme.red;
			slot.front.backgroundColor = selected ? theme.selected : theme.chrome;
		}
	}
}
