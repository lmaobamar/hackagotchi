import { db } from "./index";
import { userProfile, type UserProfile } from "./schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser(): Promise<UserProfile | null> {
	const [user] = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.id, 1));
	if (!user) return null;
	return user;
}
