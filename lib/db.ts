import { neon, neonConfig } from "@neondatabase/serverless";

// Neon works great over fetch; make sure we're using it (Node & edge compatible)
neonConfig.fetchConnectionCache = true;

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

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

export const sql = neon<Row>(url);
