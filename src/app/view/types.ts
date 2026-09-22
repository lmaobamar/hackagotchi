import type { ShopEntry } from "@/core/shop";

export type AppPage = "home" | "shop";

export interface PetSnapshot {
	name: string;
	hunger: number;
	happiness: number;
	energy: number;
	streakCount: number;
	isAlive: boolean;
}

export interface BuyPromptSnapshot {
	item: ShopEntry;
	quantity: number;
}

export interface AppSnapshot {
	coins: number;
	pet: PetSnapshot | null;
	shop: ShopEntry[];
	page: AppPage;
	selectedShopIndex: number;
	feedback: string;
	buyPrompt: BuyPromptSnapshot | null;
}

export interface AppViewActions {
	navigate: (page: AppPage) => void;
	selectShop: (index: number) => void;
	openBuyPrompt: () => void;
	closeBuyPrompt: () => void;
	changeBuyQuantity: (delta: number) => void;
	confirmBuy: () => void;
}

export type ViewportMode = "tiny" | "compact" | "standard" | "wide";
