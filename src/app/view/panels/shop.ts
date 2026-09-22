import {
	BoxRenderable,
	ScrollBoxRenderable,
	TextRenderable,
	type CliRenderer,
} from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions, ViewportMode } from "../types";
import { Panel } from "./panel";
import { ShopCounter } from "./shopCounter";
import { Shopkeeper } from "./shopkeeper";

export class ShopPanel extends Panel {
	private readonly scroll: ScrollBoxRenderable;
	private readonly counter: ShopCounter;
	private readonly summary: TextRenderable;
	private selectedIndex = 0;
	private page: AppSnapshot["page"] = "home";

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "column",
		});
		super(root);
		this.scroll = new ScrollBoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			scrollX: false,
			scrollY: true,
			contentOptions: { alignItems: "center", paddingRight: 1 },
			verticalScrollbarOptions: { visible: false },
		});
		this.scroll.verticalScrollBar.visible = false;
		const scene = new BoxRenderable(renderer, {
			width: "100%",
			maxWidth: 76,
			flexShrink: 0,
			flexDirection: "column",
			paddingTop: 1,
			paddingBottom: 1,
		});
		const keeper = new Shopkeeper(renderer);
		this.counter = new ShopCounter(renderer, actions);
		scene.add(keeper.root);
		scene.add(this.counter.root);
		this.scroll.add(scene);
		this.summary = new TextRenderable(renderer, {
			content: "",
			height: 2,
			flexShrink: 0,
			marginTop: 1,
			wrapMode: "word",
			fg: theme.muted,
			selectable: false,
		});
		root.add(this.scroll);
		root.add(this.summary);
	}

	update(snapshot: AppSnapshot, _mode: ViewportMode): void {
		this.counter.update(snapshot);
		if (snapshot.page === "shop" && this.page === "shop" &&
			snapshot.selectedShopIndex !== this.selectedIndex) {
			this.scroll.scrollChildIntoView(this.counter.root.id);
		}
		this.selectedIndex = snapshot.selectedShopIndex;
		this.page = snapshot.page;
		const entry = snapshot.shop[snapshot.selectedShopIndex];
		if (!entry) {
			this.summary.content = "The counter is empty today.";
			return;
		}
		const status = entry.stock <= 0
			? "Sold out"
			: snapshot.coins < entry.item.price
				? `Need ${entry.item.price - snapshot.coins} more coins`
				: "Enter to buy";
		this.summary.content = `${entry.item.name} · ${entry.item.price} coins · ${status}\n${entry.item.description}`;
	}

	scrollBy(direction: number): void {
		this.scroll.scrollBy(direction, "viewport");
	}

	setVisible(visible: boolean): void {
		this.root.visible = visible;
	}
}
