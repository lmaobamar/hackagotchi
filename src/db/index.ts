import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import path from "path";
import { getAppDataLocation } from "@/helpers/storageLocation";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import migrations from "./migrations";

const dbDir = getAppDataLocation();
const dbPath = path.join(dbDir, "hackagotchi.db");

export const sqlite = new Database(dbPath);
sqlite.run("PRAGMA journal_mode = WAL;");
sqlite.run("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, { schema });
export function runMigrations(): void {
	migrate(db, migrations);
}
