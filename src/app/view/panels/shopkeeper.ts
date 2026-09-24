import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import orpheusArt from "@/art/orpheusArt";
import { theme } from "@/app/theme";
import { Panel } from "./panel";

type ShopSceneTier = "full" | "medium" | "tiny";

const speech = "Lorem ipsum sit dolor amet";
const artLines = orpheusArt.confused.split("\n");

export class Shopkeeper extends Panel {
	private readonly bubble: BoxRenderable;
	private readonly pointer: TextRenderable;
	private readonly art: TextRenderable;
	private tier: ShopSceneTier = "full";

	constructor(renderer: CliRenderer) {
		const root = new BoxRenderable(renderer, {
			width: "100%",
			flexShrink: 0,
			flexDirection: "column",
			alignItems: "center",
		});
		super(root);
		this.bubble = new BoxRenderable(renderer, {
			width: 35,
			height: 3,
			flexShrink: 0,
			paddingX: 1,
			border: true,
			borderStyle: "rounded",
			borderColor: theme.muted,
			backgroundColor: theme.chrome,
		});
		this.bubble.add(
			new TextRenderable(renderer, {
				content: speech,
				fg: theme.fg,
				wrapMode: "none",
				selectable: false,
			}),
		);
		root.add(this.bubble);
		this.pointer = new TextRenderable(renderer, {
			content: "                       ╲",
			width: 35,
			height: 1,
			flexShrink: 0,
			fg: theme.muted,
			selectable: false,
		});
		root.add(this.pointer);
		this.art = new TextRenderable(renderer, {
			content: orpheusArt.confused,
			width: Math.max(...artLines.map((line) => line.length)),
			height: artLines.length,
			flexShrink: 0,
			wrapMode: "none",
			fg: theme.cyan,
			selectable: false,
		});
		root.add(this.art);
	}

	update(tier: ShopSceneTier): void {
		if (tier === this.tier) return;
		this.tier = tier;
		this.bubble.visible = tier === "full";
		this.pointer.visible = tier === "full";
		this.art.content =
			tier === "full"
				? orpheusArt.confused
				: tier === "medium"
					? orpheusArt.compact
					: orpheusArt.minimal;
		this.art.width =
			tier === "full"
				? Math.max(...artLines.map((line) => line.length))
				: tier === "medium"
					? 6
					: 4;
		this.art.height =
			tier === "full" ? artLines.length : tier === "medium" ? 3 : 1;
	}
}
