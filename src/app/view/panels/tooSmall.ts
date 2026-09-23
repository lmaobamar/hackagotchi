import { TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { ViewportMode } from "../types";
import { Panel } from "./panel";

export class TooSmallPanel extends Panel {
	constructor(renderer: CliRenderer) {
		super(
			new TextRenderable(renderer, {
				content:
					"Hackagotchi needs at least 48 x 17\nResize to continue, or press q to quit.",
				fg: theme.muted,
				width: "100%",
				height: "100%",
				wrapMode: "word",
				selectable: false,
			}),
		);
	}

	update(mode: ViewportMode): void {
		this.root.visible = mode === "tiny";
	}
}
