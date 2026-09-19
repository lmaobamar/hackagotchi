import { db, sqlite, runMigrations } from "@/db";
import { sql } from "drizzle-orm";
import { initAppDatabase } from "./db/init";

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

// raw sql..
// this is temporary. its sort of just a test to see if all my crap worked!
const [version] = db.get<[string]>(sql`SELECT sqlite_version();`);
console.log("sqlite ver:", version);
