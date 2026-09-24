// todo: its all todo
import psList, { type ProcessDescriptor } from "ps-list";
import { getCodeEditorsByPlatform } from "./editorsByPlatform";

// this is slow!!
// and doesnt fucking work
export async function editorFound(): Promise<boolean> {
	const targetEditors = new Set(
		getCodeEditorsByPlatform().map((editor) => editor.toLowerCase()),
	);
	const proclist: ProcessDescriptor[] = await psList();
	for (const p of proclist) {
		console.log(p.name);
	}
	return proclist.some((process) =>
		targetEditors.has(process.name.toLowerCase()),
	);
}
