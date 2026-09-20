import {
	CliRenderEvents,
	createCliRenderer,
	type KeyEvent,
} from "@opentui/core";
import petModule from "@/core/pet";
import { getDailyShop } from "@/core/shop";
import transactions from "@/core/transactions";
import { InsufficientFundsError } from "@/db/errors";
import { getAppInitState } from "@/db/init";
import { AppView, type AppPage, type AppSnapshot } from "./view";
import { theme } from "./theme";

export async function startApp() {
	const renderer = await createCliRenderer({
		exitOnCtrlC: true,
		backgroundColor: theme.bg,
	});
	let disposed = false;
	let busy = false;
	let view: AppView | null = null;
	let snapshot: AppSnapshot = {
		coins: 0,
		pet: null,
		shop: [],
		page: "home",
		selectedShopIndex: 0,
		feedback: "",
	};

	const render = () => {
		if (!disposed) view?.update(snapshot);
	};
	const reload = async () => {
		const state = await getAppInitState();
		const shop = state.user ? getDailyShop(state.user.secret) : [];
		snapshot = {
			...snapshot,
			coins: state.user?.coins ?? 0,
			pet: state.pet,
			shop,
			selectedShopIndex: Math.max(
				0,
				Math.min(snapshot.selectedShopIndex, Math.max(0, shop.length - 1)),
			),
		};
		render();
		return state;
	};
	const fail = (message: string) => {
		snapshot = { ...snapshot, feedback: message };
		render();
	};
	const navigate = (page: AppPage) => {
		snapshot = { ...snapshot, page, feedback: "Ready" };
		render();
	};
	const selectShop = (index: number) => {
		if (!snapshot.shop[index]) return;
		snapshot = { ...snapshot, selectedShopIndex: index, feedback: "Ready" };
		render();
	};
	const purchase = async () => {
		if (busy || disposed) return;
		busy = true;
		try {
			const state = await getAppInitState();
			const entry = snapshot.shop[snapshot.selectedShopIndex];
			if (!state.user || !entry) {
				fail("Unable to load that item.");
				return;
			}
			await transactions.buyItem(state.user, entry.item.id, 1);
			snapshot = {
				...snapshot,
				feedback: `${entry.item.name} added to inventory.`,
			};
			await reload();
		} catch (error) {
			fail(
				error instanceof InsufficientFundsError
					? "Not enough coins for that item."
					: "Unable to complete that purchase.",
			);
		} finally {
			busy = false;
		}
	};
	const createPet = async () => {
		if (busy || disposed || snapshot.pet) return;
		busy = true;
		try {
			await petModule.createPet("Orpheus Jr");
			snapshot = {
				...snapshot,
				feedback: "Orpheus Jr has moved into the habitat.",
			};
			await reload();
		} catch {
			fail("Unable to create a pet right now.");
		} finally {
			busy = false;
		}
	};
	const handleKey = async (key: KeyEvent) => {
		try {
			if (key.name === "q") {
				renderer.destroy();
				return;
			}
			if (key.name === "\\" && process.env.NODE_ENV !== "production") {
				renderer.console.toggle();
				return;
			}
			if (key.name === "h" || key.name === "escape") return navigate("home");
			if (key.name === "s") return navigate("shop");
			if (key.name === "c") return await createPet();
			if (snapshot.page !== "shop") return;
			if (key.name === "up" || key.name === "k")
				return selectShop(Math.max(0, snapshot.selectedShopIndex - 1));
			if (key.name === "down" || key.name === "j")
				return selectShop(
					Math.min(snapshot.shop.length - 1, snapshot.selectedShopIndex + 1),
				);
			if (key.name === "1" || key.name === "2" || key.name === "3")
				return selectShop(Number(key.name) - 1);
			if (key.name === "return" || key.name === "enter") await purchase();
		} catch {
			fail("Unable to update Hackagotchi right now.");
		}
	};
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		renderer.keyInput.off("keypress", handleKey);
		view?.destroy();
		view = null;
	};

	try {
		const initial = await getAppInitState();
		if (initial.pet) await petModule.updateStreak(initial.pet.userId);
		await reload();
		view = new AppView(
			renderer,
			{
				navigate,
				selectShop,
				purchaseSelected: () => {
					void purchase().catch(() =>
						fail("Unable to complete that purchase."),
					);
				},
			},
			snapshot,
		);
		renderer.keyInput.on("keypress", handleKey);
		renderer.once(CliRenderEvents.DESTROY, dispose);
	} catch (error) {
		dispose();
		renderer.destroy();
		throw error;
	}
}
