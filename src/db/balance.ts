import { db } from ".";
import { UserNotFoundInternalError, InsufficientFundsError } from "./errors";
import { userProfile } from "./schema";
import { eq, sql, and, gte } from "drizzle-orm";

function creditCoinsSync(amount: number, userId: number = 1): void {
	if (amount <= 0) return;

	const result = db
		.update(userProfile)
		.set({
			coins: sql`coins + ${amount}`,
		})
		.where(eq(userProfile.id, userId))
		.returning({ updatedId: userProfile.id })
		.all();

	if (result.length === 0) {
		throw new UserNotFoundInternalError();
	}
}

function debitCoinsSync(amount: number, userId: number = 1): void {
	if (amount <= 0) return;

	db.transaction((tx) => {
		const result = tx
			.update(userProfile)
			.set({
				coins: sql`coins - ${amount}`,
			})
			.where(and(eq(userProfile.id, userId), gte(userProfile.coins, amount)))
			.returning({ updatedId: userProfile.id })
			.all();

		if (result.length === 0) {
			const [user] = tx
				.select({ id: userProfile.id })
				.from(userProfile)
				.where(eq(userProfile.id, userId))
				.all();

			if (!user) {
				throw new UserNotFoundInternalError();
			}

			throw new InsufficientFundsError();
		}
	});
}

export default {
	creditCoinsSync,
	debitCoinsSync,
};
