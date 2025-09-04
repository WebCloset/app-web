import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

type Row = {
  id: number;
  brand: string | null;
  title: string;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  let rows: Row[] = [];

  if (q === "") {
    // No search term: show recent/popular (no WHERE filters)
    const text = `
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        ic.image_url,
        MIN(s.price_cents) AS price_cents,
        COUNT(s.*)         AS listings_count
      FROM item_canonical ic
      JOIN item_links   l ON l.canonical_id = ic.id AND l.active
      JOIN item_source  s ON s.id = l.source_id
      GROUP BY ic.id
      ORDER BY price_cents NULLS LAST, ic.id DESC
      LIMIT 24;
    `;
    rows = (await sql(text)) as unknown as Row[];
  } else {
    // Search term present: parameterized ILIKEs
    const text = `
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        ic.image_url,
        MIN(s.price_cents) AS price_cents,
        COUNT(s.*)         AS listings_count
      FROM item_canonical ic
      JOIN item_links   l ON l.canonical_id = ic.id AND l.active
      JOIN item_source  s ON s.id = l.source_id
      WHERE $1 = '' OR ic.title ILIKE $2 OR ic.brand ILIKE $2 OR ic.category ILIKE $2
      GROUP BY ic.id
      ORDER BY price_cents NULLS LAST, ic.id DESC
      LIMIT 24;
    `;
    const like = `%${q}%`;
    rows = (await sql(text, [q, like])) as unknown as Row[];
  }

  return NextResponse.json(
    { items: rows },
    { headers: { "cache-control": "no-store, max-age=0" } }
  );
}
