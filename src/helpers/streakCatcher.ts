// todo: its all todo
import psList, { type ProcessDescriptor } from "ps-list";
import { getCodeEditorsByPlatform } from "./editorsByPlatform";

// this is slow!!
async function editorFound(): Promise<boolean> {
	const proclist: ProcessDescriptor[] = await psList();
	let foundIt: boolean = false;
	for (const process of proclist) {
		for (const editor in getCodeEditorsByPlatform()) {
			if (process.cmd === editor) {
				foundIt = true;
			}
		}
	}
	return foundIt;
}
