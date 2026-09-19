import { db } from "@/db";
import { pet } from "@/db/schema";

async function createPet(name: string): Promise<void> {
	await db
		.insert(pet)
		.values({
			name: name,
		})
		.onConflictDoNothing();
}

export default { createPet };
