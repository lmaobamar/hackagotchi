import { startApp } from "@/app";
import { runMigrations, sqlite } from "@/db";
import { initAppDatabase, recordLastAppLaunch } from "@/db/init";
import { processDecay } from "@/core/decay";

function shutdownTemp() {
	// console.log("shutdownTemp");
	if (sqlite.filename) {
		sqlite.close();
	}
}

process.on("exit", shutdownTemp);
process.on("SIGINT", () => {
	shutdownTemp();
	process.exit(0);
});
process.on("SIGTERM", () => {
	shutdownTemp();
	process.exit(0);
});

runMigrations();
await initAppDatabase();
await processDecay();
await recordLastAppLaunch();
await startApp();
