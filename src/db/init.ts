import { db, sqlite } from "./index";
import { userProfile, pet, type Pet, type UserProfile } from "./schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "./user";

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
	sqlite.run(`
		CREATE TABLE IF NOT EXISTS shop_purchases (
			user_id INTEGER NOT NULL DEFAULT 1 REFERENCES user_profile(id) ON DELETE CASCADE,
			epoch_day INTEGER NOT NULL,
			item_id TEXT NOT NULL,
			quantity INTEGER NOT NULL DEFAULT 0,
			PRIMARY KEY (user_id, epoch_day, item_id)
		);
	`);
}

export async function recordLastAppLaunch(): Promise<void> {
	const user = await getCurrentUser();
	if (!user) return;
	await db
		.update(userProfile)
		.set({ lastLaunchedApp: new Date().toISOString() })
		.where(eq(userProfile.id, user.id));
}
