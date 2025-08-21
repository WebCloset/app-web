import { neon } from "@neondatabase/serverless";

// DATABASE_URL is injected by Vercel (and you locally via .env.local if needed)
const conn = process.env.DATABASE_URL!;
if (!conn) throw new Error("Missing DATABASE_URL");

export const sql = neon(conn);

// Strong row type used by /api/search
export type Row = {
  id: number;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number;
};
