import { defineConfig } from "drizzle-kit";
import { getAppDataLocation } from "@/helpers/storageLocation";
import path from "path";

const dbPath = path.join(getAppDataLocation(), "hackagotchi.db");

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: dbPath,
	},
});
