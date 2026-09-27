import { EventEmitter } from "node:events";
import { db } from "@/db";
import { pet } from "@/db/schema";
import { eq } from "drizzle-orm";
import { editorFound } from "@/helpers/streakCatcher";

function localDate(d: Date = new Date()): string {
	const parts = new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(d);
	const value = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === type)?.value;
	return `${value("year")}-${value("month")}-${value("day")}`;
}

const streakEvents = new EventEmitter();
const recordedDays = new Map<number, string>();

function previousDate(date: string): string {
	const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
	const value = new Date(year, month - 1, day);
	value.setDate(value.getDate() - 1);
	return localDate(value);
}

async function expireStreak(userId: number, today = localDate()): Promise<boolean> {
	const [current] = await db
		.select({
			id: pet.id,
			streakCount: pet.streakCount,
			lastStreakDate: pet.lastStreakDate,
		})
		.from(pet)
		.where(eq(pet.userId, userId));

	if (!current?.lastStreakDate || current.streakCount === 0) return false;
	if (current.lastStreakDate >= previousDate(today)) return false;

	await db
		.update(pet)
		.set({
			streakCount: 0,
			previousStreak: current.streakCount,
			lastStreakDate: null,
		})
		.where(eq(pet.id, current.id));

	return true;
}

async function recordStreak(userId: number = 1): Promise<number> {
	const today = localDate();
	await expireStreak(userId, today);

	const [current] = await db
		.select({
			id: pet.id,
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
		.where(eq(pet.id, current.id));

	return newStreak;
}

async function updateStreak(
	userId: number = 1,
	intervalMs = 3000,
): Promise<() => void> {
	let checking = false;

	const check = async () => {
		if (checking) return;
		checking = true;
		try {
			let changed = await expireStreak(userId);
			const today = localDate();
			if (recordedDays.get(userId) !== today && (await editorFound())) {
				await recordStreak(userId);
				recordedDays.set(userId, today);
				changed = true;
			}
			if (changed) {
				streakEvents.emit("plsredraw");
			}
		} catch (err) {
			console.error("updateStreak check failed:", err);
		} finally {
			checking = false;
		}
	};

	await check();
	const timer = setInterval(() => void check(), intervalMs);

	return () => clearInterval(timer);
}

export default { recordStreak, expireStreak, updateStreak, streakEvents };
