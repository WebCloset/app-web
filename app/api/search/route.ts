import { NextResponse } from "next/server";
import { sql, type Row } from "@/lib/db";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    let rowsAny: unknown[];

    if (q === "") {
      // No filter: show recent/popular (no WHERE with params)
      rowsAny = await sql`
        SELECT
          ic.id,
          ic.brand,
          ic.title,
          ic.category,
          ic.image_url,
          MIN(l.price_cents)    AS price_cents,
          COUNT(l.*)            AS listings_count
        FROM item_canonical ic
        JOIN item_links l ON l.canonical_id = ic.id AND l.active
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24;
      `;
    } else {
      // Filtered by q across title/brand/category using the same param
      const like = `%${q}%`;
      rowsAny = await sql`
        SELECT
          ic.id,
          ic.brand,
          ic.title,
          ic.category,
          ic.image_url,
          MIN(l.price_cents)    AS price_cents,
          COUNT(l.*)            AS listings_count
        FROM item_canonical ic
        JOIN item_links l ON l.canonical_id = ic.id AND l.active
        WHERE
             ic.title    ILIKE ${like}
          OR ic.brand    ILIKE ${like}
          OR ic.category ILIKE ${like}
        GROUP BY ic.id
        ORDER BY price_cents NULLS LAST, ic.id DESC
        LIMIT 24;
      `;
    }

    // Cast once (avoid generic type arg on the template literal)
    const rows = rowsAny as Row[];

    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "search_failed", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
