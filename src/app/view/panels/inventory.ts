import {
	BoxRenderable,
	ScrollBoxRenderable,
	TextRenderable,
	type CliRenderer,
} from "@opentui/core";
import { theme } from "@/app/theme";
import { ITEMS } from "@/core/items";
import type { AppSnapshot, ViewportMode } from "../types";
import { Panel } from "./panel";

interface InventoryRow {
	container: BoxRenderable;
	title: TextRenderable;
	description: TextRenderable;
}

export class InventoryPanel extends Panel {
	private readonly scroll: ScrollBoxRenderable;
	private readonly scene: BoxRenderable;
	private readonly summary: TextRenderable;
	private readonly rows: InventoryRow[];
	private page: AppSnapshot["page"] = "home";

	constructor(renderer: CliRenderer) {
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
		this.rows = Array.from({ length: ITEMS.length }, () => {
			const container = new BoxRenderable(renderer, {
				width: "100%",
				flexShrink: 0,
				flexDirection: "column",
				paddingLeft: 1,
				paddingRight: 1,
			});
			const title = new TextRenderable(renderer, {
				content: "",
				fg: theme.fg,
				height: 1,
				maxWidth: "100%",
				wrapMode: "none",
				truncate: true,
				selectable: false,
			});
			const description = new TextRenderable(renderer, {
				content: "",
				fg: theme.muted,
				height: 1,
				maxWidth: "100%",
				wrapMode: "none",
				truncate: true,
				selectable: false,
			});
			container.add(title);
			container.add(description);
			this.scene.add(container);
			return { container, title, description };
		});
		this.scroll.add(this.scene);
		this.summary = new TextRenderable(renderer, {
			content: "",
			height: 2,
			flexShrink: 0,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			fg: theme.muted,
			selectable: false,
		});
		root.add(this.scroll);
		root.add(this.summary);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		const compact = mode === "compact";
		this.scene.padding = compact ? 0 : 1;
		if (snapshot.page !== this.page) {
			this.scroll.scrollTo({ x: 0, y: 0 });
			this.page = snapshot.page;
		}
		const entries = snapshot.inventory;
		for (const [index, row] of this.rows.entries()) {
			const entry = entries[index];
			row.container.visible = Boolean(entry);
			if (!entry) continue;
			row.title.content = `${entry.quantity}x ${entry.item.name}`;
			row.title.fg = entry.quantity > 0 ? theme.fg : theme.muted;
			row.description.content = compact ? "" : entry.item.description;
			row.description.visible = !compact;
		}
		const total = entries.reduce((sum, entry) => sum + entry.quantity, 0);
		this.summary.content = entries.length
			? `${entries.length} item ${entries.length === 1 ? "type" : "types"} · ${total} in total\nPress s to restock`
			: "Your bag is empty.\nPress s to visit the shop.";
	}

	scrollBy(direction: number): void {
		this.scroll.scrollBy(direction, "viewport");
	}

	setVisible(visible: boolean): void {
		this.root.visible = visible;
	}
}
