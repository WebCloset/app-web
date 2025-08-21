import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

type Row = {
  id: number;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const like = `%${q}%`;

  let rows: any[];

  if (q === "") {
    // No search term: show recently seen items
    rows = await sql`
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        i.image_url,
        i.price_cents,
        i.listings_count
      FROM item_canonicals ic
      LEFT JOIN items i
        ON i.canonical_id = ic.id
       AND i.active = true
      ORDER BY i.last_seen DESC NULLS LAST, ic.id DESC
      LIMIT 24
    `;
  } else {
    // With search term: fuzzy match on title/brand/category
    rows = await sql`
      SELECT
        ic.id,
        ic.brand,
        ic.title,
        ic.category,
        i.image_url,
        i.price_cents,
        i.listings_count
      FROM item_canonicals ic
      LEFT JOIN item_links l
        ON l.canonical_id = ic.id
      LEFT JOIN items i
        ON i.source = l.source_id
       AND i.active = true
      WHERE
           ic.title    ILIKE ${like}
        OR ic.brand    ILIKE ${like}
        OR ic.category ILIKE ${like}
      GROUP BY
        ic.id, ic.brand, ic.title, ic.category,
        i.image_url, i.price_cents, i.listings_count
      ORDER BY i.price_cents NULLS LAST, ic.id DESC
      LIMIT 24
    `;
  }

  const items: Row[] = rows as any;
  return NextResponse.json({ items });
}
