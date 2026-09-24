import { db } from "@/db";
import { eq } from "drizzle-orm";
import { pet } from "@/db/schema";
import petArt, { type PetSpriteName } from "@/art/petArt";

function pickRandom<T>(arr: readonly T[]): T {
	const index = Math.floor(Math.random() * arr.length);
	const item = arr[index];
	if (item === undefined) {
		throw new Error("pickRandom: array is empty");
	}
	return item;
}

export function getRandomPetSpriteName(): PetSpriteName {
	const PET_SPRITE_NAMES = Object.keys(petArt) as PetSpriteName[];
	return pickRandom(PET_SPRITE_NAMES);
}

async function createPet(name: string): Promise<void> {
	await db
		.insert(pet)
		.values({
			name: name,
			petStyle: getRandomPetSpriteName(),
		})
		.onConflictDoNothing();
}

function localDate(d: Date = new Date()): string {
	return d.toLocaleDateString("en-CA");
}

async function updateStreak(userId: number = 1): Promise<number> {
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

async function renamePet(name: string, userId: number = 1): Promise<void> {
	const clean = name.trim().slice(0, 20);
	if (!clean) return;
	await db.update(pet).set({ name: clean }).where(eq(pet.userId, userId));
}

export default { createPet, renamePet, updateStreak };
