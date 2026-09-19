import { sqlite, runMigrations } from "@/db";
import { initAppDatabase } from "@/db/init";
import { startApp } from "@/app";

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
await startApp();
