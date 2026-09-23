// im literally just guessing LOL
export function getCodeEditorsByPlatform() {
	switch (process.platform) {
		case "linux":
		case "darwin":
			return [
				"code",
				"code-insiders",
				"codium",
				"nvim",
				"vim",
				"zed",
				"zeditor",
				"nano",
			];
		case "win32":
			return [
				"code.exe",
				"code-insiders.exe",
				"codium.exe",
				"nvim.exe",
				"vim.exe",
				"zed.exe",
			];
		default:
			throw new Error("getCodeEditorsByPlatform not impl for this platform");
	}
}
