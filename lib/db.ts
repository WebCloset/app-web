import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is not set");
}

// Use a dummy URL during build time if not set
const dbUrl = url || "postgresql://dummy:dummy@localhost:5432/dummy";

// Generic Row type for convenience
export type Row = {
  id: number;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number;
};

export const sql = neon(dbUrl);
