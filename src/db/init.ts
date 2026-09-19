import { db } from "./index";
import { userProfile, pet, type Pet, type UserProfile } from "./schema";
import { eq } from "drizzle-orm";

export interface AppInitState {
	user: UserProfile;
	pet: Pet | null;
}

// This is unfinished
async function initAppDatabase(): Promise<AppInitState> {
	return await db.transaction(async (tx) => {
		let user = tx.select().from(userProfile).where(eq(userProfile.id, 1)).get();
		if (!user) {
			user = tx
				.insert(userProfile)
				.values({})
				.onConflictDoNothing()
				.returning()
				.get();
		}

		if (!user) {
			user = tx.select().from(userProfile).where(eq(userProfile.id, 1)).get()!;
		}

		return { user, pet: null };
	});
}
