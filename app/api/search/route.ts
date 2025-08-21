import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Row = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};

export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();

  try {
    let rows: Row[];

    if (q === "") {
      // No search term: show recent/popular items
      rows = await sql<Row>`
        SELECT
          ic.id,
          ic.brand,
          ic.title,
          ic.category,
          ic.image_url,
          MIN(s.price_cents) AS price_cents,
          COUNT(DISTINCT s.id) AS listings_count
        FROM item_canonical ic
        LEFT JOIN item_links l ON l.canonical_id = ic.id
        LEFT JOIN item_sources s ON s.id = l.source_id AND l.active
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24
      `;
    } else {
      const like = `%${q}%`;
      rows = await sql<Row>`
        SELECT
          ic.id,
          ic.brand,
          ic.title,
          ic.category,
          ic.image_url,
          MIN(s.price_cents) AS price_cents,
          COUNT(DISTINCT s.id) AS listings_count
        FROM item_canonical ic
        LEFT JOIN item_links l ON l.canonical_id = ic.id
        LEFT JOIN item_sources s ON s.id = l.source_id AND l.active
        WHERE ic.title ILIKE ${like}
           OR ic.brand ILIKE ${like}
           OR ic.category ILIKE ${like}
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24
      `;
    }

    return NextResponse.json({ items: rows });
  } catch (err) {
    console.error("search route error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
