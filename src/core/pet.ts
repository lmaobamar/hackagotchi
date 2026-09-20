import { db } from "@/db";
import { eq } from "drizzle-orm";
import { pet } from "@/db/schema";

async function createPet(name: string): Promise<void> {
	await db
		.insert(pet)
		.values({
			name: name,
		})
		.onConflictDoNothing();
}

async function updateStreak(userId: number = 1): Promise<number> {
	const today = new Date().toISOString().slice(0, 10);

	const [current] = await db
	    .select({streakCount: pet.streakCount, lastStreakDate: pet.lastStreakDate })
		.from(pet)
		.where(eq(pet.userId, userId));

	if (!current) return 0;

	if (current.lastStreakDate === today) {
		return current.streakCount;
	}

	const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
	const newStreak = current.lastStreakDate === yesterday ? current.streakCount + 1 : 1;

	await db
	    .update(pet)
		.set({ streakCount: newStreak, lastStreakDate: today })
		.where(eq(pet.userId, userId));
	
	return newStreak;	
}

export default { createPet, updateStreak };
