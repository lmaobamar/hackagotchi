import type { AppSnapshot } from "./view/types";

export function createInitialSnapshot(): AppSnapshot {
	return {
		coins: 0,
		pet: null,
		shop: [],
		page: "home",
		selectedShopIndex: 0,
		feedback: "",
		buyPrompt: null,
	};
}
