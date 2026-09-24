export function getCodeEditorsByPlatform(): string[] {
	switch (process.platform) {
		case "linux":
			return [
				// VS Code
				"code",
				"code-insiders",
				"code-oss",
				"codium",
				"cursor",
				"windsurf",
				// Terminal
				"nvim",
				"vim",
				"nano",
				"helix",
				"hx",
				"micro",
				"emacs",
				// Lightweight GUI
				"zed",
				"zeditor",
				"sublime_text",
				"subl",
				"kate",
				"gedit",
				"gnome-text-editor",
				"geany",
				"lapce",
				// JetBrains IDEs
				"idea",
				"clion",
				"webstorm",
				"pycharm",
				"goland",
				"rider",
				"fleet",
				"datagrip",
				"phpstorm",
				"rustrover",
			];

		case "darwin": // macOS
			return [
				// VS Code
				"Code",
				"Code - Insiders",
				"Code - OSS",
				"VSCodium",
				"Cursor",
				"Windsurf",
				"Visual Studio Code",
				// Terminal
				"nvim",
				"vim",
				"nano",
				"helix",
				"hx",
				"micro",
				"emacs",
				// macOS native/GUI
				"Zed",
				"Sublime Text",
				"TextMate",
				"BBEdit",
				"Nova",
				"Xcode",
				"Lapce",
				// JetBrains IDEs
				"idea",
				"clion",
				"webstorm",
				"pycharm",
				"goland",
				"rider",
				"fleet",
				"datagrip",
				"phpstorm",
				"rustrover",
			];

		case "win32":
			return [
				// VS Code
				"code.exe",
				"code-insiders.exe",
				"code-oss.exe",
				"codium.exe",
				"cursor.exe",
				"windsurf.exe",
				// Terminal
				"nvim.exe",
				"vim.exe",
				"nano.exe",
				"hx.exe",
				"micro.exe",
				// GUI editors
				"zed.exe",
				"sublime_text.exe",
				"notepad++.exe",
				"notepad.exe",
				"devenv.exe", // Visual Studio
				"lapce.exe",
				// JetBrains IDEs
				"idea64.exe",
				"clion64.exe",
				"webstorm64.exe",
				"pycharm64.exe",
				"goland64.exe",
				"rider64.exe",
				"fleet.exe",
				"datagrip64.exe",
				"phpstorm64.exe",
				"rustrover64.exe",
			];

		default:
			throw new Error(
				`getCodeEditorsByPlatform not implemented for platform: ${process.platform}`,
			);
	}
}
