import { startApp } from "@/app";
import { runMigrations, sqlite } from "@/db";
import { initAppDatabase, recordLastAppLaunch } from "@/db/init";
import { processDecay } from "@/core/decay";

function shutdown() {
	// console.log("shutdown");
	if (sqlite.filename) {
		sqlite.close();
	}
}

process.on("exit", shutdown);
process.on("SIGINT", () => {
	shutdown();
	process.exit(0);
});
process.on("SIGTERM", () => {
	shutdown();
	process.exit(0);
});

runMigrations();
await initAppDatabase();
await processDecay();
await recordLastAppLaunch();
await startApp();
