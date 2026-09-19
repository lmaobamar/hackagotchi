import { db } from "./index";
import { userProfile, pet, type Pet, type UserProfile } from "./schema";
import { eq } from "drizzle-orm";

export interface AppInitState {
	user: UserProfile | null;
	pet: Pet | null;
}

// Will use this soon
export async function getAppInitState(): Promise<AppInitState> {
	return await db.transaction(async (tx) => {
		const userExists = tx
			.select()
			.from(userProfile)
			.where(eq(userProfile.id, 1))
			.get();
		const petExists = tx.select().from(pet).where(eq(pet.id, 1)).get();
		return { user: userExists ?? null, pet: petExists ?? null };
	});
}

export async function initAppDatabase(): Promise<void> {
	await db.insert(userProfile).values({}).onConflictDoNothing();
}
