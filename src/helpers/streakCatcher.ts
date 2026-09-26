// todo: its all todo
import psList, { type ProcessDescriptor } from "ps-list";
import { getCodeEditorsByPlatform } from "./editorsByPlatform";

// this is slow!!
// and doesnt fucking work
export async function editorFound(): Promise<boolean> {
	const targetEditors = new Set(
		getCodeEditorsByPlatform().map((editor) => editor.toLowerCase()),
	);
	const proclist = await psList();
	return proclist.some((p) => {
		const haystack = (p.cmd ?? p.name).toLowerCase();
		return [...targetEditors].some((editor) => haystack.includes(editor));
	});
}
