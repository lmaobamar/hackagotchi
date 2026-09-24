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

type ShopSceneTier = "full" | "medium" | "tiny";

export class ShopPanel extends Panel {
	private readonly scroll: ScrollBoxRenderable;
	private readonly scene: BoxRenderable;
	private readonly counter: ShopCounter;
	private readonly keeper: Shopkeeper;
	private readonly summary: TextRenderable;
	private selectedIndex = 0;
	private page: AppSnapshot["page"] = "home";
	private tier: ShopSceneTier | null = null;

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
		this.scene = new BoxRenderable(renderer, {
			width: "100%",
			maxWidth: 76,
			flexShrink: 0,
			flexDirection: "column",
			paddingTop: 1,
			paddingBottom: 1,
		});
		this.keeper = new Shopkeeper(renderer);
		this.counter = new ShopCounter(renderer, actions);
		this.scene.add(this.keeper.root);
		this.scene.add(this.counter.root);
		this.scroll.add(this.scene);
		this.summary = new TextRenderable(renderer, {
			content: "",
			height: 2,
			flexShrink: 0,
			marginTop: 0,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			fg: theme.muted,
			selectable: false,
		});
		root.add(this.scroll);
		root.add(this.summary);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode, width: number, height: number): void {
		const sceneWidth = width - (mode === "wide" ? 52 : mode === "standard" ? 23 : 1);
		const sceneHeight = height - (mode === "compact" ? 5 : 10);
		const tier: ShopSceneTier = sceneWidth >= 39 && sceneHeight >= 30
			? "full"
			: sceneHeight >= 10 ? "medium" : "tiny";
		this.scroll.visible = true;
		this.summary.height = tier === "full" || tier === "medium" ? 2 : 1;
		this.summary.marginTop = tier === "full" ? 1 : 0;
		this.scene.padding = tier === "full" ? 1 : 0;
		this.keeper.update(tier);
		this.counter.update(snapshot, tier);
		if (snapshot.page === "shop" && this.page === "shop" &&
			snapshot.selectedShopIndex !== this.selectedIndex) {
			this.scroll.scrollChildIntoView(this.counter.root.id);
		}
		if (snapshot.page !== this.page || tier !== this.tier) {
			this.scroll.scrollTo({ x: 0, y: 0 });
		}
		this.tier = tier;
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
		this.summary.content = tier === "full" || tier === "medium"
			? `${entry.item.name} · ${entry.item.price} coins · ${status}\n${entry.item.description}`
			: `${entry.stock <= 0 ? "Sold out" : snapshot.coins < entry.item.price ? `Need ${entry.item.price - snapshot.coins}c` : "Buy"} · ${entry.item.name}`;
	}

	scrollBy(direction: number): void {
		this.scroll.scrollBy(direction, "viewport");
	}

	setVisible(visible: boolean): void {
		this.root.visible = visible;
	}
}
