// location helper per platform

import fs from "fs";
import os from "os";
import path from "path";

let decidedPath: string;
export function getAppDataLocation() {
	if (decidedPath) return decidedPath;
	const homedir = os.homedir();
	switch (process.platform) {
		case "win32": {
			const localAppData = process.env.LOCALAPPDATA;
			if (localAppData) {
				decidedPath = path.join(localAppData, "hackagotchi");
				break;
			}
			decidedPath = path.join(homedir, "AppData", "Local", "hackagotchi");
			break;
		}
		case "darwin":
			decidedPath = path.join(
				homedir,
				"Library",
				"Application Support",
				"hackagotchi",
			);
			break;
		case "linux":
			decidedPath = path.join(homedir, ".local", "share", "hackagotchi");
			break;
		default:
			throw new Error("Unsupported platform!!");
	}
	if (!decidedPath) throw new Error("That's not supposed to happen");
	if (!fs.existsSync(decidedPath))
		fs.mkdirSync(decidedPath, { recursive: true });
	return decidedPath;
}
