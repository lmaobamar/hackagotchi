// magic streak tracking technology 3000.
import { getCurrentUser } from "@/db/user";
import { db } from "@/db";
import { pet } from "@/db/schema";
import { eq } from "drizzle-orm";
import { editorFound } from "@/helpers/streakCatcher";

function localDate(d: Date = new Date()): string {
	return d.toLocaleDateString("en-CA");
}

async function recordStreak(userId: number = 1): Promise<number> {
	const today = localDate();

	const [current] = await db
		.select({
			streakCount: pet.streakCount,
			lastStreakDate: pet.lastStreakDate,
		})
		.from(pet)
		.where(eq(pet.userId, userId));

	if (!current) return 0;

	if (current.lastStreakDate === today) {
		return current.streakCount;
	}

	const y = new Date();
	y.setDate(y.getDate() - 1);
	const yesterday = localDate(y);
	const newStreak =
		current.lastStreakDate === yesterday ? current.streakCount + 1 : 1;

	await db
		.update(pet)
		.set({ streakCount: newStreak, lastStreakDate: today })
		.where(eq(pet.userId, userId));

	return newStreak;
}

let recordedToday: string | null = null;

function updateStreak(userId: number = 1, intervalMs = 3000): () => void {
	let checking = false;

	const timer = setInterval(async () => {
		if (checking) return;
		checking = true;
		try {
			const today = localDate();
			if (recordedToday !== today && (await editorFound())) {
				await recordStreak(userId);
				recordedToday = today;
			}
		} catch (err) {
			console.error("updateStreak check failed:", err);
		} finally {
			checking = false;
		}
	}, intervalMs);

	return () => clearInterval(timer); // call to stop polling
}

export default { recordStreak, updateStreak };
