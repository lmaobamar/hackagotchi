import type { ViewportMode } from "./types";

export function getViewportMode(width: number, height: number): ViewportMode {
	if (width < 48 || height < 17) return "tiny";
	if (width < 76 || height < 22) return "compact";
	if (width >= 112 && height >= 30) return "wide";
	return "standard";
}
