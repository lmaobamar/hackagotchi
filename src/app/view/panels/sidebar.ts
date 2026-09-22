import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, AppViewActions, ViewportMode } from "../types";
import { Panel } from "./panel";

export class SidebarPanel extends Panel {
	private readonly homeNav: TextRenderable;
	private readonly shopNav: TextRenderable;

	constructor(renderer: CliRenderer, actions: AppViewActions) {
		const root = new BoxRenderable(renderer, {
			width: 20,
			flexShrink: 0,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["right"],
			borderColor: theme.border,
			flexDirection: "column",
			gap: 1,
		});
		super(root);
		this.root.add(
			new TextRenderable(renderer, {
				content: "Hackagotchi",
				fg: theme.muted,
				selectable: false,
			}),
		);
		this.homeNav = new TextRenderable(renderer, {
			content: "  Home",
			fg: theme.fg,
			selectable: false,
			onMouseDown: () => actions.navigate("home"),
		});
		this.shopNav = new TextRenderable(renderer, {
			content: "  Shop",
			fg: theme.fg,
			selectable: false,
			onMouseDown: () => actions.navigate("shop"),
		});
		this.root.add(this.homeNav);
		this.root.add(this.shopNav);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		this.root.visible = mode === "standard" || mode === "wide";
		this.homeNav.content = `${snapshot.page === "home" ? ">" : " "} Home`;
		this.shopNav.content = `${snapshot.page === "shop" ? ">" : " "} Shop`;
		this.homeNav.bg = snapshot.page === "home" ? theme.selected : theme.chrome;
		this.shopNav.bg = snapshot.page === "shop" ? theme.selected : theme.chrome;
	}
}
