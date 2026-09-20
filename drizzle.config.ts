import { defineConfig } from "drizzle-kit";
import path from "path";
import { getAppDataLocation } from "@/helpers/storageLocation";

const dbPath = path.join(getAppDataLocation(), "hackagotchi.db");

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: dbPath,
	},
});
