import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL!;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Plain client; we'll cast results at call sites.
export const sql = neon(DATABASE_URL);
