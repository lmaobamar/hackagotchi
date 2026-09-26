import type { StartupInfo } from "@/app/types/startupInfo";
import { db } from "@/db";
import { getAppInitState, type AppInitState } from "@/db/init";
import { pet } from "@/db/schema";
import { eq } from "drizzle-orm";
import petModule from "@/core/pet";

// TODO:
export async function processDecay(): Promise<StartupInfo> {
	const state: AppInitState = await getAppInitState();
	const user = state.user;
	const currentPet = state.pet;
	const newStreak = currentPet
		? await petModule.updateStreak(currentPet.userId)
		: 0;
	if (!user || !user.lastLaunchedApp || !currentPet)
		return { died: false, streakCount: newStreak };

	const lastLaunchTime = user.lastLaunchedApp
		? new Date(user.lastLaunchedApp).getTime()
		: Date.now();
	const currentTime = Date.now();
	const elapsedSeconds = Math.max(
		0,
		Math.floor((currentTime - lastLaunchTime) / 1000),
	);

	// complete starvation takes about 3 days (259200 seconds) of total inactivity
	const hungerLoss = Math.floor(elapsedSeconds / 2592);
	const happinessLoss = Math.floor(elapsedSeconds / 3456);

	let newHunger = currentPet.hunger - hungerLoss;
	let newHappiness = currentPet.happiness - happinessLoss;
	let isAlive = true;

	if (elapsedSeconds > 1209600 || newHunger <= 0 || newHappiness <= 0) {
		newHunger = 0;
		newHappiness = 0;
		isAlive = false;
	}

	await db
		.update(pet)
		.set({ hunger: newHunger, happiness: newHappiness, isAlive })
		.where(eq(pet.id, currentPet.id));

	// TODO: streak
	return { died: !isAlive, streakCount: newStreak };
}
