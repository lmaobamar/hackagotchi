import type { ViewportMode } from "./types";

export const MIN_VIEWPORT_WIDTH = 40;
export const MIN_VIEWPORT_HEIGHT = 12;

export function getViewportMode(width: number, height: number): ViewportMode {
	if (width < MIN_VIEWPORT_WIDTH || height < MIN_VIEWPORT_HEIGHT) return "tiny";
	if (width < 76 || height < 22) return "compact";
	if (width >= 112 && height >= 30) return "wide";
	return "standard";
}
