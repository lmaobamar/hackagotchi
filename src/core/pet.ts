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

async function renamePet(name: string, userId: number = 1): Promise<void> {
	const clean = name.trim().slice(0, 20);
	if (!clean) return;
	await db.update(pet).set({ name: clean }).where(eq(pet.userId, userId));
}

export default { createPet, renamePet };
