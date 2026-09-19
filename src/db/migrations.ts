import path from "path";
import fs from "fs";

const drizzleDir = Bun.isStandaloneExecutable
	? path.join(import.meta.dir, "drizzle")
	: path.join(import.meta.dir, "..", "..", "drizzle");
const journal = JSON.parse(
	fs.readFileSync(path.join(drizzleDir, "meta", "_journal.json"), "utf8"),
);

function buildMigrationsMap() {
	const migrations: Record<string, string> = {};
	for (const file of fs.readdirSync(drizzleDir)) {
		if (file.endsWith(".sql")) {
			const filename = file.replace(/\.sql$/, "");
			migrations[filename] = fs.readFileSync(
				path.join(drizzleDir, file),
				"utf8",
			);
		}
	}
	return migrations;
}

export default {
	journal,
	migrations: buildMigrationsMap(),
	migrationsFolder: drizzleDir,
};
