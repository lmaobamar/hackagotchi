import {
	CliRenderEvents,
	type CliRenderer,
	type KeyEvent,
} from "@opentui/core";
import balance from "@/core/balance";
import petModule from "@/core/pet";
import shopModule from "@/core/shop";
import transactions from "@/core/transactions";
import { InsufficientFundsError } from "@/db/errors";
import { getAppInitState } from "@/db/init";
import { createInitialSnapshot } from "./state";
import {
	AppView,
	type AppPage,
	type AppSnapshot,
	type AppViewActions,
} from "./view";

export class AppController {
	private snapshot: AppSnapshot = createInitialSnapshot();
	private view: AppView | null = null;
	private busy = false;
	private disposed = false;

	constructor(private readonly renderer: CliRenderer) {}

	async start(): Promise<void> {
		const initial = await getAppInitState();
		if (initial.pet) await petModule.updateStreak(initial.pet.userId);
		await this.reload();
		this.view = new AppView(this.renderer, this.actions, this.snapshot);
		this.renderer.keyInput.on("keypress", this.handleKey);
		this.renderer.once(CliRenderEvents.DESTROY, this.dispose);
	}

	private render = () => {
		if (!this.disposed) this.view?.update(this.snapshot);
	};

	private reload = async () => {
		const state = await getAppInitState();
		const shop = state.user
			? shopModule.getDailyShop(state.user.secret, state.user.id)
			: [];
		this.snapshot = {
			...this.snapshot,
			coins: state.user?.coins ?? 0,
			pet: state.pet,
			shop,
			selectedShopIndex: Math.max(
				0,
				Math.min(
					this.snapshot.selectedShopIndex,
					Math.max(0, shop.length - 1),
				),
			),
		};
		this.render();
		return state;
	};

	private fail = (message: string) => {
		this.snapshot = { ...this.snapshot, feedback: message };
		this.render();
	};

	private navigate = (page: AppPage) => {
		this.snapshot = { ...this.snapshot, page, feedback: "Ready" };
		this.render();
	};

	private selectShop = (index: number) => {
		if (!this.snapshot.shop[index]) return;
		this.snapshot = {
			...this.snapshot,
			selectedShopIndex: index,
			feedback: "Ready",
		};
		this.render();
	};

	private openBuyPrompt = () => {
		const entry = this.snapshot.shop[this.snapshot.selectedShopIndex];
		if (!entry || entry.stock <= 0) return;
		this.snapshot = {
			...this.snapshot,
			buyPrompt: { item: entry, quantity: 1 },
		};
		this.render();
	};

	private closeBuyPrompt = () => {
		this.snapshot = { ...this.snapshot, buyPrompt: null };
		this.render();
	};

	private changeBuyQuantity = (delta: number) => {
		if (!this.snapshot.buyPrompt) return;
		const maxQty = Math.max(
			1,
			Math.min(
				this.snapshot.buyPrompt.item.stock,
				Math.floor(
					this.snapshot.coins / this.snapshot.buyPrompt.item.item.price,
				) || 1,
			),
		);
		const quantity = Math.max(
			1,
			Math.min(maxQty, this.snapshot.buyPrompt.quantity + delta),
		);
		this.snapshot = {
			...this.snapshot,
			buyPrompt: { ...this.snapshot.buyPrompt, quantity },
		};
		this.render();
	};

	private purchase = async () => {
		if (this.busy || this.disposed) return;
		if (!this.snapshot.buyPrompt) return;
		this.busy = true;
		try {
			const state = await getAppInitState();
			const prompt = this.snapshot.buyPrompt;
			if (!state.user || !prompt) {
				this.fail("Unable to load that item.");
				return;
			}
			await transactions.buyItem(
				state.user,
				prompt.item.item.id,
				prompt.quantity,
			);
			this.snapshot = {
				...this.snapshot,
				buyPrompt: null,
				feedback: `${prompt.quantity}x ${prompt.item.item.name} added to inventory.`,
			};
			await this.reload();
		} catch (error) {
			this.snapshot = { ...this.snapshot, buyPrompt: null };
			this.fail(
				error instanceof InsufficientFundsError
					? "Not enough coins for that item."
					: "Unable to complete that purchase.",
			);
		} finally {
			this.busy = false;
		}
	};

	private createPet = async () => {
		if (this.busy || this.disposed || this.snapshot.pet) return;
		this.busy = true;
		try {
			await petModule.createPet("Orpheus Jr");
			this.snapshot = {
				...this.snapshot,
				feedback: "Orpheus Jr has moved into the habitat.",
			};
			await this.reload();
		} catch {
			this.fail("Unable to create a pet right now.");
		} finally {
			this.busy = false;
		}
	};

	private actions: AppViewActions = {
		navigate: this.navigate,
		selectShop: this.selectShop,
		openBuyPrompt: this.openBuyPrompt,
		closeBuyPrompt: this.closeBuyPrompt,
		changeBuyQuantity: this.changeBuyQuantity,
		confirmBuy: () => {
			void this.purchase().catch(() =>
				this.fail("Unable to complete that purchase."),
			);
		},
	};

	private handleKey = async (key: KeyEvent) => {
		try {
			if (key.name === "q") {
				this.renderer.destroy();
				return;
			}
			if (key.name === "c" && process.env.NODE_ENV !== "production") {
				balance.creditCoinsSync(1000, 1);
			}
			if (key.name === "\\" && process.env.NODE_ENV !== "production") {
				this.renderer.console.toggle();
				return;
			}
			if (this.snapshot.buyPrompt) {
				if (key.name === "escape") return this.closeBuyPrompt();
				if (key.name === "left" || key.name === "-")
					return this.changeBuyQuantity(-1);
				if (key.name === "right" || key.name === "+" || key.name === "=")
					return this.changeBuyQuantity(1);
				if (key.name === "return" || key.name === "enter")
					return await this.purchase();
				return;
			}
			if (key.name === "h" || key.name === "escape")
				return this.navigate("home");
			if (key.name === "s") return this.navigate("shop");
			if (key.name === "c") return await this.createPet();
			if (this.snapshot.page !== "shop") return;
			if (key.name === "pageup") return this.view?.scrollShop(-1);
			if (key.name === "pagedown") return this.view?.scrollShop(1);
			if (key.name === "up" || key.name === "k")
				return this.selectShop(
					Math.max(0, this.snapshot.selectedShopIndex - 1),
				);
			if (key.name === "down" || key.name === "j")
				return this.selectShop(
					Math.min(
						this.snapshot.shop.length - 1,
						this.snapshot.selectedShopIndex + 1,
					),
				);
			if (key.name === "1" || key.name === "2" || key.name === "3")
				return this.selectShop(Number(key.name) - 1);
			if (key.name === "return" || key.name === "enter")
				return this.openBuyPrompt();
		} catch {
			this.fail("Unable to update Hackagotchi right now.");
		}
	};

	dispose = () => {
		if (this.disposed) return;
		this.disposed = true;
		this.renderer.keyInput.off("keypress", this.handleKey);
		this.view?.destroy();
		this.view = null;
	};
}
