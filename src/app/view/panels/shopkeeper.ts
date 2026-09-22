import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import orpheusArt from "@/art/orpheusArt";
import { theme } from "@/app/theme";
import { Panel } from "./panel";

const speech = "Lorem ipsum sit dolor amet...";
const artLines = orpheusArt.confused.split("\n");

export class Shopkeeper extends Panel {
	constructor(renderer: CliRenderer) {
		const root = new BoxRenderable(renderer, {
			width: "100%",
			flexShrink: 0,
			flexDirection: "column",
			alignItems: "center",
		});
		super(root);
		const bubble = new BoxRenderable(renderer, {
			width: 35,
			height: 3,
			flexShrink: 0,
			paddingX: 1,
			border: true,
			borderStyle: "rounded",
			borderColor: theme.muted,
			backgroundColor: theme.chrome,
		});
		bubble.add(new TextRenderable(renderer, {
			content: speech,
			fg: theme.fg,
			wrapMode: "none",
			selectable: false,
		}));
		root.add(bubble);
		root.add(new TextRenderable(renderer, {
			content: "                       ╲",
			width: 35,
			height: 1,
			flexShrink: 0,
			fg: theme.muted,
			selectable: false,
		}));
		root.add(new TextRenderable(renderer, {
			content: orpheusArt.confused,
			width: Math.max(...artLines.map((line) => line.length)),
			height: artLines.length,
			flexShrink: 0,
			wrapMode: "none",
			fg: theme.cyan,
			selectable: false,
		}));
	}
}
