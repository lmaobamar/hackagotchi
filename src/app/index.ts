import { createCliRenderer } from "@opentui/core";
import { AppController } from "./controller";
import { theme } from "./theme";

export async function startApp() {
	const renderer = await createCliRenderer({
		exitOnCtrlC: true,
		backgroundColor: theme.bg,
	});
	const controller = new AppController(renderer);
	try {
		await controller.start();
	} catch (error) {
		controller.dispose();
		renderer.destroy();
		throw error;
	}
}
