import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import type { ShopEntry } from "@/core/shop";
import orpheusArt from "@/art/orpheusArt";
import { theme } from "./theme";

export type AppPage = "home" | "shop";

export interface PetSnapshot {
	name: string;
	hunger: number;
	happiness: number;
	energy: number;
	streakCount: number;
	isAlive: boolean;
}

export interface AppSnapshot {
	coins: number;
	pet: PetSnapshot | null;
	shop: ShopEntry[];
	page: AppPage;
	selectedShopIndex: number;
	feedback: string;
}

export interface AppViewActions {
	navigate: (page: AppPage) => void;
	selectShop: (index: number) => void;
	purchaseSelected: () => void;
}

export type ViewportMode = "tiny" | "compact" | "standard" | "wide";

export function getViewportMode(width: number, height: number): ViewportMode {
	if (width < 48 || height < 17) return "tiny";
	if (width < 76 || height < 22) return "compact";
	if (width >= 112 && height >= 30) return "wide";
	return "standard";
}

function meter(label: string, value: number): string {
	const filled = Math.max(0, Math.min(10, Math.round(value / 10)));
	return `${label.padEnd(10)} ${"●".repeat(filled)}${"○".repeat(10 - filled)} ${String(value).padStart(3)}%`;
}

function petArt(): string {
	return `    /\\_/\\
   ( o.o )
     > ^ <`;
}

export class AppView {
	private readonly shell: BoxRenderable;
	private readonly tooSmall: TextRenderable;
	private readonly sidebar: BoxRenderable;
	private readonly rail: BoxRenderable;
	private readonly homeNav: TextRenderable;
	private readonly shopNav: TextRenderable;
	private readonly heading: TextRenderable;
	private readonly balance: TextRenderable;
	private readonly main: BoxRenderable;
	private readonly home: BoxRenderable;
	private readonly petName: TextRenderable;
	private readonly habitatArea: BoxRenderable;
	private readonly habitat: TextRenderable;
	private readonly condition: TextRenderable;
	private readonly statRows: TextRenderable[];
	private readonly shopPanel: BoxRenderable;
	private readonly shopRows: TextRenderable[];
	private readonly shopSummary: TextRenderable;
	private readonly shopKeeperArea: BoxRenderable;
	private readonly shopKeeperLabel: TextRenderable;
	private readonly shopKeeperArt: TextRenderable;
	private readonly railTitle: TextRenderable;
	private readonly detail: TextRenderable;
	private readonly railAction: TextRenderable;
	private readonly railArt: TextRenderable;
	private readonly hints: TextRenderable;
	private readonly feedback: TextRenderable;
	private snapshot: AppSnapshot;

	constructor(
		private readonly renderer: CliRenderer,
		private readonly actions: AppViewActions,
		snapshot: AppSnapshot,
	) {
		this.snapshot = snapshot;
		this.shell = new BoxRenderable(renderer, {
			width: "100%",
			height: "100%",
			backgroundColor: theme.bg,
			flexDirection: "column",
		});
		this.tooSmall = new TextRenderable(renderer, {
			content:
				"Hackagotchi needs at least 48 × 17\nResize to continue, or press q to quit.",
			fg: theme.muted,
			width: "100%",
			height: "100%",
			wrapMode: "word",
			selectable: false,
		});
		const header = new BoxRenderable(renderer, {
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
		this.balance = new TextRenderable(renderer, {
			content: "◈ 0 coins  ·  ◇ 0 day streak",
			fg: theme.yellow,
			selectable: false,
		});
		header.add(this.balance);
		const body = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "row",
			backgroundColor: theme.bg,
			titleAlignment: "right",
			overflow: "hidden",
		});
		this.sidebar = new BoxRenderable(renderer, {
			width: 20,
			flexShrink: 0,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["right"],
			borderColor: theme.border,
			flexDirection: "column",
			gap: 1,
		});
		this.sidebar.add(
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
			onMouseDown: () => this.actions.navigate("home"),
		});
		this.shopNav = new TextRenderable(renderer, {
			content: "  Shop",
			fg: theme.fg,
			selectable: false,
			onMouseDown: () => this.actions.navigate("shop"),
		});
		this.sidebar.add(this.homeNav);
		this.sidebar.add(this.shopNav);
		this.main = new BoxRenderable(renderer, {
			flexGrow: 1,
			minWidth: 0,
			minHeight: 0,
			padding: 1,
			flexDirection: "column",
			gap: 0,
			overflow: "hidden",
		});
		this.heading = new TextRenderable(renderer, {
			content: "HOME",
			fg: theme.accent,
			selectable: false,
		});
		this.main.add(this.heading);
		this.home = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "column",
			gap: 0,
		});
		this.petName = new TextRenderable(renderer, {
			content: "",
			fg: theme.violet,
			alignSelf: "center",
			selectable: false,
		});
		this.habitatArea = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "column",
			justifyContent: "center",
		});
		this.habitat = new TextRenderable(renderer, {
			content: "",
			fg: theme.cyan,
			alignSelf: "center",
			selectable: false,
		});
		this.habitatArea.add(this.habitat);
		this.condition = new TextRenderable(renderer, {
			content: "",
			fg: theme.green,
			selectable: false,
		});
		this.statRows = [theme.yellow, theme.violet, theme.cyan].map(
			(fg) =>
				new TextRenderable(renderer, { content: "", fg, selectable: false }),
		);
		this.home.add(this.petName);
		this.home.add(this.habitatArea);
		this.home.add(this.condition);
		for (const row of this.statRows) this.home.add(row);
		this.main.add(this.home);
		this.shopPanel = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "column",
			gap: 0,
		});
		this.shopRows = [0, 1, 2].map(
			(index) =>
				new TextRenderable(renderer, {
					content: "",
					fg: theme.fg,
					bg: theme.bg,
					height: 3,
					wrapMode: "word",
					selectable: false,
					onMouseDown: () => this.actions.selectShop(index),
				}),
		);
		for (const row of this.shopRows) this.shopPanel.add(row);
		this.shopSummary = new TextRenderable(renderer, {
			content: "",
			fg: theme.muted,
			height: 3,
			wrapMode: "word",
			selectable: false,
		});
		this.shopPanel.add(this.shopSummary);
		this.shopKeeperArea = new BoxRenderable(renderer, {
			minHeight: 0,
			flexDirection: "column",
			padding: 1,
			border: ["top"],
			borderColor: theme.border,
		});
		this.shopKeeperLabel = new TextRenderable(renderer, {
			content: "Orpheus",
			fg: theme.violet,
			selectable: false,
		});
		this.shopKeeperArt = new TextRenderable(renderer, {
			content: "",
			fg: theme.cyan,
			selectable: false,
		});
		this.shopKeeperArea.add(this.shopKeeperLabel);
		this.shopKeeperArea.add(this.shopKeeperArt);
		this.shopPanel.add(this.shopKeeperArea);
		this.main.add(this.shopPanel);
		this.rail = new BoxRenderable(renderer, {
			width: 30,
			flexShrink: 0,
			padding: 1,
			backgroundColor: theme.chrome,
			border: ["left"],
			borderColor: theme.border,
			flexDirection: "column",
			gap: 1,
		});
		this.railTitle = new TextRenderable(renderer, {
			content: "Details",
			fg: theme.muted,
			selectable: false,
		});
		this.rail.add(this.railTitle);
		this.detail = new TextRenderable(renderer, {
			content: "",
			fg: theme.fg,
			wrapMode: "word",
			selectable: false,
		});
		this.rail.add(this.detail);
		this.railAction = new TextRenderable(renderer, {
			content: "",
			fg: theme.accent,
			selectable: false,
			onMouseDown: () => {
				const selected = this.snapshot.shop[this.snapshot.selectedShopIndex];
				if (
					selected &&
					selected.stock > 0 &&
					this.snapshot.coins >= selected.item.price
				) {
					this.actions.purchaseSelected();
				}
			},
		});
		this.railArt = new TextRenderable(renderer, {
			content: "",
			fg: theme.yellow,
			selectable: false,
		});
		this.rail.add(this.railAction);
		this.rail.add(this.railArt);
		body.add(this.sidebar);
		body.add(this.main);
		body.add(this.rail);
		const footer = new BoxRenderable(renderer, {
			height: 3,
			flexShrink: 0,
			paddingX: 1,
			backgroundColor: theme.chrome,
			border: ["top"],
			borderColor: theme.border,
			flexDirection: "column",
		});
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
		footer.add(this.feedback);
		footer.add(this.hints);
		this.shell.add(header);
		this.shell.add(body);
		this.shell.add(footer);
		renderer.root.add(this.shell);
		renderer.root.add(this.tooSmall);
		renderer.root.onSizeChange = () => this.update(this.snapshot);
		this.update(snapshot);
	}

	update(snapshot: AppSnapshot): void {
		this.snapshot = snapshot;
		const pet = snapshot.pet;
		this.balance.content = `◈ ${snapshot.coins} coins  ·  ◇ ${pet?.streakCount ?? 0} day streak`;
		this.homeNav.content = `${snapshot.page === "home" ? "›" : " "} Home`;
		this.shopNav.content = `${snapshot.page === "shop" ? "›" : " "} Shop`;
		this.homeNav.bg = snapshot.page === "home" ? theme.selected : theme.chrome;
		this.shopNav.bg = snapshot.page === "shop" ? theme.selected : theme.chrome;
		this.heading.content = snapshot.page === "home" ? "Home" : "Orpheus' Shop";
		this.home.visible = snapshot.page === "home";
		this.shopPanel.visible = snapshot.page === "shop";
		const compact =
			getViewportMode(this.renderer.root.width, this.renderer.root.height) ===
			"compact";
		if (pet) {
			const lowestStat = Math.min(pet.hunger, pet.happiness, pet.energy);
			this.habitat.content = petArt();
			this.petName.content = pet.name;
			this.condition.content = !pet.isAlive
				? "Condition: needs immediate care"
				: lowestStat < 25
					? "Condition: struggling"
					: lowestStat < 55
						? "Condition: could use some care"
						: "Condition: happy!! :D";
			this.condition.fg = !pet.isAlive
				? theme.red
				: lowestStat < 55
					? theme.yellow
					: theme.green;
			this.statRows[0]!.content = meter("Hunger", pet.hunger);
			this.statRows[1]!.content = meter("Joy", pet.happiness);
			this.statRows[2]!.content = meter("Energy", pet.energy);
		} else {
			this.habitat.content = "    .--.\n   (    )\n    `--'";
			this.petName.content = "An empty habitat";
			this.condition.content = "Press c to hatch your companion.";
			this.condition.fg = theme.yellow;
			this.statRows[0]!.content = "Hunger     —";
			this.statRows[1]!.content = "Joy        —";
			this.statRows[2]!.content = "Energy     —";
		}
		for (const [index, row] of this.shopRows.entries()) {
			const entry = snapshot.shop[index];
			row.visible = snapshot.page === "shop" && Boolean(entry);
			if (!entry) continue;
			const selected = index === snapshot.selectedShopIndex;
			row.content = compact
				? `${selected ? "›" : " "} ${index + 1}. ${entry.item.name} · ${entry.item.price} coins`
				: `${selected ? "›" : " "} ${index + 1}. ${entry.item.name}  ${entry.item.price} coins\n    ${entry.item.description}`;
			row.bg = selected ? theme.selected : theme.bg;
			row.fg = selected ? theme.accent : theme.fg;
		}
		const selected = snapshot.shop[snapshot.selectedShopIndex];
		const canAfford = Boolean(
			selected && snapshot.coins >= selected.item.price,
		);
		const available = Boolean(selected && selected.stock > 0);
		this.shopSummary.content = selected
			? `${selected.item.description}\n${selected.item.price} coins · ${available ? (canAfford ? "can buy!!" : "need more coins") : "sold out"}`
			: "Choose an item to inspect.";
		this.shopSummary.fg = !available
			? theme.red
			: canAfford
				? theme.green
				: theme.yellow;
		this.shopKeeperArt.content = orpheusArt.confused;
		this.shopKeeperArea.visible = snapshot.page === "shop";
		if (snapshot.page === "home") {
			this.railTitle.content = "Habitat";
			this.detail.content = pet
				? `${pet.name}\n\n${pet.streakCount} day streak\n${pet.isAlive ? "Pet ok" : "Pet needs care"}\n\nAvailable actions\nOpen Shop for supplies\nPress s to browse`
				: "No companion has moved in yet.\n\nAvailable actions\nPress c to hatch a companion\nPress s to browse supplies";
			this.detail.fg = pet?.isAlive ? theme.fg : pet ? theme.red : theme.yellow;
			this.railAction.visible = false;
			this.railArt.visible = false;
		} else {
			this.railTitle.content = "Selected item";
			this.detail.content = selected
				? `${selected.item.name}\n\n${selected.item.description}\n\nPrice: ${selected.item.price} coins\n${available ? (canAfford ? "You can afford this." : "You need more coins.") : "Sold out."}`
				: "Choose an item to inspect.";
			this.detail.fg = !available
				? theme.red
				: canAfford
					? theme.fg
					: theme.yellow;
			this.railAction.content = available
				? canAfford
					? "[ Buy selected item ]"
					: "[ Not enough coins ]"
				: "[ Sold out ]";
			this.railAction.fg = available && canAfford ? theme.accent : theme.muted;
			this.railAction.visible = true;
			if (selected?.item.art) {
				this.railArt.content = selected.item.art;
				this.railArt.visible = true;
			} else {
				this.railArt.content = "";
				this.railArt.visible = false;
			}
		}
		this.feedback.content = snapshot.feedback;
		this.feedback.fg =
			snapshot.feedback.startsWith("Unable") ||
			snapshot.feedback.startsWith("Not enough")
				? theme.red
				: theme.green;
		this.hints.content =
			snapshot.page === "shop"
				? compact
					? "↑↓ Select  Enter Buy  Esc Home  q Quit"
					: "↑↓ / j k Select  Enter Buy  1-3 Pick  Esc Home  q Quit"
				: pet
					? "h Home  s Shop  q Quit"
					: "c Create  s Shop  q Quit";
		this.applyViewport();
	}

	private applyViewport(): void {
		const mode = getViewportMode(
			this.renderer.root.width,
			this.renderer.root.height,
		);
		this.shell.visible = mode !== "tiny";
		this.tooSmall.visible = mode === "tiny";
		this.sidebar.visible = mode === "standard" || mode === "wide";
		this.rail.visible = mode === "wide";
		this.habitatArea.flexGrow = mode === "compact" ? 0 : 1;
		this.habitatArea.height = mode === "compact" ? 3 : "auto";
		for (const row of this.shopRows) row.height = mode === "compact" ? 1 : 2;
		this.shopSummary.height = 3;
		this.shopKeeperArea.visible =
			this.snapshot.page === "shop" && mode !== "compact";
	}

	destroy(): void {
		this.renderer.root.onSizeChange = undefined;
		this.shell.destroyRecursively();
		this.tooSmall.destroyRecursively();
	}
}
