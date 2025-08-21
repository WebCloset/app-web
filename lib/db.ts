import { neon } from "@neondatabase/serverless";

// One shared SQL tag bound to your Neon connection string.
const url = process.env.DATABASE_URL!;
if (!url) throw new Error("DATABASE_URL is not set");

export const sql = neon(url);
