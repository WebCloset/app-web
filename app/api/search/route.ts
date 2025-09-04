import { NextResponse } from "next/server";
import { sql, Row } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    let rows: Row[];

    if (q === "") {
      // No search term: show recent/popular items
      rows = (await sql`
        SELECT
          ic.id,
          ic.brand,
          ic.title,
          ic.category,
          ic.image_url,
          MIN(s.price_cents) AS price_cents,
          COUNT(*)::int AS listings_count
        FROM item_canonical ic
        JOIN item_links l ON l.canonical_id = ic.id AND l.active = true
        JOIN item_source s ON s.id = l.source_id
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24
      `) as Row[];
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
          COUNT(*)::int AS listings_count
        FROM item_canonical ic
        JOIN item_links l ON l.canonical_id = ic.id AND l.active = true
        JOIN item_source s ON s.id = l.source_id
        WHERE
             ic.title ILIKE ${like}
          OR ic.brand ILIKE ${like}
          OR ic.category ILIKE ${like}
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24
      `) as Row[];
    }

    return NextResponse.json({ ok: true, items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("SEARCH_ERROR:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
