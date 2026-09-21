import {
	CliRenderEvents,
	createCliRenderer,
	type KeyEvent,
} from "@opentui/core";
import petModule from "@/core/pet";
import shopModule from "@/core/shop";
import transactions from "@/core/transactions";
import { InsufficientFundsError } from "@/db/errors";
import { getAppInitState } from "@/db/init";
import { AppView, type AppPage, type AppSnapshot } from "./view";
import { theme } from "./theme";
import balance from "@/core/balance";

export async function startApp() {
	const renderer = await createCliRenderer({
		exitOnCtrlC: true,
		backgroundColor: theme.bg,
	});
	let disposed = false;
	let busy = false;
	let nameInput: string | null = null;
	let view: AppView | null = null;
	let snapshot: AppSnapshot = {
		coins: 0,
		pet: null,
		shop: [],
		page: "home",
		selectedShopIndex: 0,
		feedback: "",
		buyPrompt: null,
	};

	const render = () => {
		if (!disposed) view?.update(snapshot);
	};
	const reload = async () => {
		const state = await getAppInitState();
		const shop = state.user
			? shopModule.getDailyShop(state.user.secret, state.user.id)
			: [];
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
	const openBuyPrompt = () => {
		const entry = snapshot.shop[snapshot.selectedShopIndex];
		if (!entry || entry.stock <= 0) return;
		snapshot = {
			...snapshot,
			buyPrompt: {
				item: entry,
				quantity: 1,
			},
		};
		render();
	};
	const closeBuyPrompt = () => {
		snapshot = { ...snapshot, buyPrompt: null };
		render();
	};
	const changeBuyQuantity = (delta: number) => {
		if (!snapshot.buyPrompt) return;
		const maxQty = Math.max(
			1,
			Math.min(
				snapshot.buyPrompt.item.stock,
				Math.floor(snapshot.coins / snapshot.buyPrompt.item.item.price) || 1,
			),
		);
		const newQty = Math.max(
			1,
			Math.min(maxQty, snapshot.buyPrompt.quantity + delta),
		);
		snapshot = {
			...snapshot,
			buyPrompt: {
				...snapshot.buyPrompt,
				quantity: newQty,
			},
		};
		render();
	};
	const purchase = async () => {
		if (busy || disposed) return;
		if (!snapshot.buyPrompt) return;
		busy = true;
		try {
			const state = await getAppInitState();
			const prompt = snapshot.buyPrompt;
			if (!state.user || !prompt) {
				fail("Unable to load that item.");
				return;
			}
			await transactions.buyItem(
				state.user,
				prompt.item.item.id,
				prompt.quantity,
			);
			snapshot = {
				...snapshot,
				buyPrompt: null,
				feedback: `${prompt.quantity}x ${prompt.item.item.name} added to inventory.`,
			};
			await reload();
		} catch (error) {
			snapshot = { ...snapshot, buyPrompt: null };
			fail(
				error instanceof InsufficientFundsError
					? "Not enough coins for that item."
					: "Unable to complete that purchase.",
			);
		} finally {
			busy = false;
		}
	};
	const createPet = async (name: string ) => {
		if (busy || disposed || snapshot.pet) return;
		busy = true;
		try {
			await petModule.createPet(name);
			snapshot = {
				...snapshot,
				feedback: `${name} has moved into the habitat`,
			};
			await reload();
		} catch {
			fail("Unable to create a pet right now.");
		} finally {
			busy = false;
		}
	};
	const showNamePrompt = () => {
		snapshot = {
			...snapshot,
			feedback: `Name your Pet: ${nameInput ?? ""}_ (max 20 chars, press Enter to confirm & Esc to cancel)`,
		};
		render();
	};
	const handleKey = async (key: KeyEvent) => {
		try {
			if (nameInput !== null) {
				if (key.name === "escape") {
					nameInput = null;
					return navigate("home");
				}
			if (key.name === "return" || key.name === "enter") {
				const chosen = nameInput.trim() || "Orpheus Jr";
				nameInput = null;
				return await createPet(chosen);
			}
			if (key.name === "backspace") {
				nameInput = nameInput.slice(0, -1);
				return showNamePrompt();
			}
			const ch = key.sequence;
			if (ch && ch.length === 1 && ch >= " " && nameInput.length < 20) {
				nameInput += ch;
			}
			return showNamePrompt();
			}	
			if (key.name === "q") {
				renderer.destroy();
				return;
			}
			if (key.name === "c" && process.env.NODE_ENV !== "production") {
				balance.creditCoinsSync(1000, 1);
			}
			if (key.name === "\\" && process.env.NODE_ENV !== "production") {
				renderer.console.toggle();
				return;
			}
			if (snapshot.buyPrompt) {
				if (key.name === "escape") return closeBuyPrompt();
				if (key.name === "left" || key.name === "-")
					return changeBuyQuantity(-1);
				if (key.name === "right" || key.name === "+" || key.name === "=")
					return changeBuyQuantity(1);
				if (key.name === "return" || key.name === "enter")
					return await purchase();
				return;
			}
			if (key.name === "h" || key.name === "escape") return navigate("home");
			if (key.name === "s") return navigate("shop");
			if (key.name === "c") {
				if (snapshot.pet) return;
				nameInput = "";
				return showNamePrompt();
			}
			if (snapshot.page !== "shop") return;
			if (key.name === "up" || key.name === "k")
				return selectShop(Math.max(0, snapshot.selectedShopIndex - 1));
			if (key.name === "down" || key.name === "j")
				return selectShop(
					Math.min(snapshot.shop.length - 1, snapshot.selectedShopIndex + 1),
				);
			if (key.name === "1" || key.name === "2" || key.name === "3")
				return selectShop(Number(key.name) - 1);
			if (key.name === "return" || key.name === "enter") return openBuyPrompt();
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
				openBuyPrompt,
				closeBuyPrompt,
				changeBuyQuantity,
				confirmBuy: () => {
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
