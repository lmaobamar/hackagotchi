import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getCodeEditorsByPlatform } from "./editorsByPlatform";

const execFileAsync = promisify(execFile);

export async function editorFound(): Promise<boolean> {
	const targets = getCodeEditorsByPlatform().map((e) => e.toLowerCase());

	if (process.platform === "win32") {
		const { stdout } = await execFileAsync("tasklist", ["/fo", "csv", "/nh"]);
		const output = stdout.toLowerCase();
		return targets.some((t) => output.includes(t));
	}

	const pattern = targets.join("|");
	try {
		await execFileAsync("pgrep", ["-i", "-f", pattern]);
		return true; // exit code 0 = at least one match
	} catch (err) {
		if ((err as { code?: number }).code === 1) return false; // no match
		throw err;
	}
}
