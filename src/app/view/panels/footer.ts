import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, ViewportMode } from "../types";
import { Panel } from "./panel";

export class FooterPanel extends Panel {
	private readonly feedback: TextRenderable;
	private readonly hints: TextRenderable;

	constructor(renderer: CliRenderer) {
		const root = new BoxRenderable(renderer, {
			height: 3,
			flexShrink: 0,
			paddingX: 1,
			backgroundColor: theme.chrome,
			border: ["top"],
			borderColor: theme.border,
			flexDirection: "column",
		});
		super(root);
		this.feedback = new TextRenderable(renderer, {
			content: "",
			fg: theme.green,
			truncate: true,
			selectable: false,
		});
		this.hints = new TextRenderable(renderer, {
			content: "h Home  s Shop  q Quit",
			fg: theme.muted,
			truncate: true,
			selectable: false,
		});
		this.root.add(this.feedback);
		this.root.add(this.hints);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		this.feedback.content = snapshot.feedback;
		this.feedback.fg =
			snapshot.feedback.startsWith("Unable") ||
			snapshot.feedback.startsWith("Not enough")
				? theme.red
				: theme.green;
		if (snapshot.buyPrompt) {
			this.hints.content =
				"← / - Decrease  → / + Increase  Enter Confirm  Esc Cancel";
			return;
		}
		const compact = mode === "compact";
		this.hints.content =
			snapshot.page === "shop"
				? compact
					? "↑↓ Pick  Enter Buy  PgUp/Dn Scroll  q Quit"
					: "↑↓ / j k Pick  Enter Buy  PgUp/Dn Scroll  Esc Home  q Quit"
				: snapshot.pet
					? "h Home  s Shop  q Quit"
					: "c Create  s Shop  q Quit";
	}
}
