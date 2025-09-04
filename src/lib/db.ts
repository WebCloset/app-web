import { neon } from "@neondatabase/serverless";

// Vercel injects env vars; ensure DATABASE_URL is set there.
const conn = process.env.DATABASE_URL;
if (!conn && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is not set");
}

// Use a dummy URL during build time if not set
const dbUrl = conn || "postgresql://dummy:dummy@localhost:5432/dummy";
export const sql = neon(dbUrl);
