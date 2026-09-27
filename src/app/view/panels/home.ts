/** biome-ignore-all lint/style/noNonNullAssertion: <no explanation> */
import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import { theme } from "@/app/theme";
import type { AppSnapshot, ViewportMode } from "@/app/view/types";
import { meter } from "@/app/view/format";
import { Panel } from "./panel";
import petArt, { compactPetArt } from "@/art/petArt";
import streak from "@/core/streak";

type Mood = "idle" | "happy" | "hungry" | "sleeping" | "sad";

const STRUGGLING_THRESHOLD = 25;

function getMood(
	pet: NonNullable<AppSnapshot["pet"]>,
	doneStreak: boolean,
): Mood {
	if (!pet.isAlive) return "sad";

	const stats: Array<{ mood: Mood; value: number }> = [
		{ mood: "hungry", value: pet.hunger },
		{ mood: "sad", value: pet.happiness },
		{ mood: "sleeping", value: pet.energy },
	];

	const worst = stats.reduce((a, b) => (b.value < a.value ? b : a));
	if (worst.value < STRUGGLING_THRESHOLD) return worst.mood;

	return doneStreak ? "happy" : "idle";
}
const EMPTY_HABITAT = "    .--.\n   (    )\n    `--'";

export class HomePanel extends Panel {
	private readonly petName: TextRenderable;
	private readonly habitatArea: BoxRenderable;
	private readonly habitat: TextRenderable;
	private readonly condition: TextRenderable;
	private readonly statRows: TextRenderable[];

	constructor(renderer: CliRenderer) {
		const root = new BoxRenderable(renderer, {
			flexGrow: 1,
			minHeight: 0,
			flexDirection: "column",
			gap: 0,
		});
		super(root);
		this.petName = new TextRenderable(renderer, {
			content: "",
			fg: theme.violet,
			alignSelf: "center",
			height: 1,
			maxWidth: "100%",
			wrapMode: "none",
			truncate: true,
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
		this.root.add(this.petName);
		this.root.add(this.habitatArea);
		this.root.add(this.condition);
		for (const row of this.statRows) this.root.add(row);
	}

	async update(snapshot: AppSnapshot, mode: ViewportMode): Promise<void> {
		const compact = mode === "compact";
		this.habitatArea.flexGrow = compact ? 0 : 1;
		this.habitatArea.flexShrink = compact ? 0 : 1;
		this.habitatArea.height = compact ? 3 : "auto";
		this.condition.truncate = compact;
		for (const row of this.statRows) row.truncate = compact;
		const pet = snapshot.pet;
		if (pet) {
			const lowestStat = Math.min(pet.hunger, pet.happiness, pet.energy);
			const style = pet.petStyle as keyof typeof petArt;
			const art = compact
				? compactPetArt[style as keyof typeof compactPetArt]
				: petArt[style];

			const doneStreak = await streak.hasDoneStreakToday();
			const mood = getMood(pet, doneStreak);
			const PET_ART = art[mood];
			console.log(`${style} ggfrickinez`);
			this.habitat.content = PET_ART;
			this.petName.content = pet.name;
			this.condition.content = compact
				? !pet.isAlive
					? "Needs care"
					: lowestStat < 25
						? "Struggling"
						: lowestStat < 55
							? "Needs care"
							: "Happy"
				: !pet.isAlive
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
			return;
		}
		this.habitat.content = compact ? " .--.\n(    )\n `--'" : EMPTY_HABITAT;
		this.petName.content = "An empty habitat";
		this.condition.content = "Press c to hatch your companion.";
		this.condition.fg = theme.yellow;
		this.statRows[0]!.content = "Hunger     -";
		this.statRows[1]!.content = "Joy        -";
		this.statRows[2]!.content = "Energy     -";
	}

	setVisible(visible: boolean): void {
		this.root.visible = visible;
	}
}
