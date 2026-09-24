import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, ViewportMode } from "../types";
import { Panel } from "./panel";

export class HeaderPanel extends Panel {
	private readonly box: BoxRenderable;
	private readonly balance: TextRenderable;

	constructor(renderer: CliRenderer) {
		const root = new BoxRenderable(renderer, {
			height: 3,
			flexShrink: 0,
			paddingX: 1,
			backgroundColor: theme.chrome,
			border: ["bottom"],
			borderColor: theme.border,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		});
		super(root);
		this.box = root;
		this.balance = new TextRenderable(renderer, {
			content: "◈ 0 coins  ·  ◇ 0 day streak",
			fg: theme.yellow,
			height: 1,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
			selectable: false,
		});
		this.root.add(this.balance);
	}

	update(snapshot: AppSnapshot, mode: ViewportMode): void {
		const compact = mode === "compact";
		this.box.height = compact ? 1 : 3;
		this.box.paddingX = compact ? 0 : 1;
		this.box.border = compact ? false : ["bottom"];
		this.balance.content = compact
			? `◈ ${snapshot.coins} · ◇ ${snapshot.pet?.streakCount ?? 0}`
			: `◈ ${snapshot.coins} coins  ·  ◇ ${snapshot.pet?.streakCount ?? 0} day streak`;
	}
}
