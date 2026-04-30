//db/index.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from "./schema";

//Connection string comes from .env
//Drizzle connects via supabase transaticion pooler port 6543

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

//Disable prefetch as its not used in transaction pooler
const client = postgres(connectionString, {prepare: false});

export const db = drizzle(client, {schema});