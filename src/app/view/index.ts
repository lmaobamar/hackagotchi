import { BoxRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "../theme";
import { BuyPromptPanel } from "./panels/buyPrompt";
import { DetailsRail } from "./panels/detailsRail";
import { FooterPanel } from "./panels/footer";
import { HeaderPanel } from "./panels/header";
import { MainPanel } from "./panels/main";
import { SidebarPanel } from "./panels/sidebar";
import { TooSmallPanel } from "./panels/tooSmall";
import type { AppSnapshot, AppViewActions } from "./types";
import { getViewportMode } from "./viewport";

export * from "./types";
export { getViewportMode } from "./viewport";

export class AppView {
	private readonly shell: BoxRenderable;
	private readonly header: HeaderPanel;
	private readonly sidebar: SidebarPanel;
	private readonly main: MainPanel;
	private readonly rail: DetailsRail;
	private readonly footer: FooterPanel;
	private readonly buyPrompt: BuyPromptPanel;
	private readonly tooSmall: TooSmallPanel;
	private snapshot: AppSnapshot;

	constructor(
		private readonly renderer: CliRenderer,
		actions: AppViewActions,
		snapshot: AppSnapshot,
	) {
		this.snapshot = snapshot;
		this.header = new HeaderPanel(renderer);
		this.sidebar = new SidebarPanel(renderer, actions);
		this.main = new MainPanel(renderer, actions);
		this.rail = new DetailsRail(renderer, actions);
		this.footer = new FooterPanel(renderer);
		this.buyPrompt = new BuyPromptPanel(renderer, actions);
		this.tooSmall = new TooSmallPanel(renderer);

		this.shell = new BoxRenderable(renderer, {
			width: "100%",
			height: "100%",
			backgroundColor: theme.bg,
			flexDirection: "column",
		});
		const body = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "row",
			backgroundColor: theme.bg,
			titleAlignment: "right",
			overflow: "hidden",
		});
		body.add(this.sidebar.root);
		body.add(this.main.root);
		body.add(this.rail.root);
		this.shell.add(this.header.root);
		this.shell.add(body);
		this.shell.add(this.footer.root);

		renderer.root.add(this.shell);
		renderer.root.add(this.buyPrompt.root);
		renderer.root.add(this.tooSmall.root);
		renderer.root.onSizeChange = () => this.update(this.snapshot);
		this.update(snapshot);
	}

	update(snapshot: AppSnapshot): void {
		this.snapshot = snapshot;
		const mode = getViewportMode(
			this.renderer.root.width,
			this.renderer.root.height,
		);
		this.shell.visible = mode !== "tiny";
		this.header.update(snapshot);
		this.sidebar.update(snapshot, mode);
		this.main.update(snapshot, mode);
		this.rail.update(snapshot, mode);
		this.footer.update(snapshot, mode);
		this.buyPrompt.update(snapshot);
		this.tooSmall.update(mode);
	}

	scrollShop(direction: number): void {
		this.main.shop.scrollBy(direction);
	}

	destroy(): void {
		this.renderer.root.onSizeChange = undefined;
		this.shell.destroyRecursively();
		this.buyPrompt.destroy();
		this.tooSmall.destroy();
	}
}
