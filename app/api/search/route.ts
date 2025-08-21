import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

type Row = {
  id: number;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  // Build a single LIKE token once, or null when q is empty.
  const like = q === "" ? null : `%${q}%`;

  // Type Neon’s result as Row[] so TS is happy.
  const rows = (await sql<Row>`
    SELECT
      ic.id,
      ic.brand,
      ic.title,
      ic.category,
      ic.image_url,
      MIN(s.price_cents)    AS price_cents,
      COUNT(s.*)            AS listings_count
    FROM item_canonical ic
    JOIN item_links   l ON l.canonical_id = ic.id AND l.active
    JOIN item_source  s ON s.id = l.source_id
    WHERE
      (${q === ""})
      OR ic.title    ILIKE ${like}
      OR ic.brand    ILIKE ${like}
      OR ic.category ILIKE ${like}
    GROUP BY ic.id
    ORDER BY price_cents NULLS LAST, ic.id DESC
    LIMIT 24;
  `) as Row[];

  return NextResponse.json({ items: rows }, { status: 200 });
}
