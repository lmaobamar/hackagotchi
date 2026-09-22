import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot } from "../types";
import { Panel } from "./panel";

export class HeaderPanel extends Panel {
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
		this.balance = new TextRenderable(renderer, {
			content: "◈ 0 coins  ·  ◇ 0 day streak",
			fg: theme.yellow,
			selectable: false,
		});
		this.root.add(this.balance);
	}

	update(snapshot: AppSnapshot): void {
		this.balance.content = `◈ ${snapshot.coins} coins  ·  ◇ ${snapshot.pet?.streakCount ?? 0} day streak`;
	}
}
