import type { Renderable } from "@opentui/core";

export abstract class Panel {
	protected constructor(readonly root: Renderable) {}

	destroy(): void {
		this.root.destroyRecursively();
	}
}
