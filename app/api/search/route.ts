import { NextResponse } from "next/server";
import { sql } from "../../../lib/db"; // relative import to avoid path alias issues

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
  const q = (searchParams.get("q") || "").trim();

  let rows: Row[];

  if (q === "") {
    // No search term: show recent/popular items without WHERE filters.
    rows = (await sql`
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        ic.image_url,
        MIN(s.price_cents) AS price_cents,
        COUNT(s.*)         AS listings_count
      FROM item_canonical ic
      JOIN item_links  l ON l.canonical_id = ic.id AND l.active
      JOIN item_source s ON s.id = l.source_id
      GROUP BY ic.id
      ORDER BY price_cents NULLS LAST, ic.id DESC
      LIMIT 24
    `) as unknown as Row[];
  } else {
    const like = `%${q}%`;
    rows = (await sql`
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        ic.image_url,
        MIN(s.price_cents) AS price_cents,
        COUNT(s.*)         AS listings_count
      FROM item_canonical ic
      JOIN item_links  l ON l.canonical_id = ic.id AND l.active
      JOIN item_source s ON s.id = l.source_id
      WHERE
           ic.title    ILIKE ${like}
        OR ic.brand    ILIKE ${like}
        OR ic.category ILIKE ${like}
      GROUP BY ic.id
      ORDER BY price_cents NULLS LAST, ic.id DESC
      LIMIT 24
    `) as unknown as Row[];
  }

  return NextResponse.json(rows, { status: 200 });
}
