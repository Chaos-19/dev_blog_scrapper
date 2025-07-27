import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema/schema.js";

const connectionString =
  process.env.NODE_ENV === "production"
    ? (process.env.DATABASE_URL_REMOTE as string)
    : (process.env.DATABASE_URL_LOCAL as string);

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
