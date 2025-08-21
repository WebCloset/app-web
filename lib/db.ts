import { neon } from "@neondatabase/serverless";

/**
 * Neon serverless SQL tag.
 * We pass row types at each call, e.g. sql<Row>`SELECT ...`
 */
export const sql = neon(process.env.DATABASE_URL!);
