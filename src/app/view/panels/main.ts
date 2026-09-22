import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions, ViewportMode } from "../types";
import { HomePanel } from "./home";
import { Panel } from "./panel";
import { ShopPanel } from "./shop";

export class MainPanel extends Panel {
	readonly home: HomePanel;
	readonly shop: ShopPanel;
	private readonly heading: TextRenderable;

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			flexGrow: 1,
			minWidth: 0,
			minHeight: 0,
			padding: 1,
			flexDirection: "column",
			gap: 0,
			overflow: "hidden",
		});
		super(root);
		this.heading = new TextRenderable(renderer, {
			content: "Home",
			fg: theme.accent,
			selectable: false,
		});
		this.home = new HomePanel(renderer);
		this.shop = new ShopPanel(renderer, actions);
		this.root.add(this.heading);
		this.root.add(this.home.root);
		this.root.add(this.shop.root);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		this.heading.content =
			snapshot.page === "home" ? "Home" : "Orpheus' Shop";
		this.home.setVisible(snapshot.page === "home");
		this.shop.setVisible(snapshot.page === "shop");
		this.home.update(snapshot, mode);
		this.shop.update(snapshot, mode);
	}
}
