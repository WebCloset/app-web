import { neon } from "@neondatabase/serverless";

// Vercel injects env vars; ensure DATABASE_URL is set there.
const conn = process.env.DATABASE_URL!;
export const sql = neon(conn);
