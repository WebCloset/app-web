import { NextResponse } from "next/server";
import { sql, Row } from "@/lib/db";

// Use Node runtime to avoid any edge-specific quirks while we stabilize
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const like = `%${q}%`;

    // Conditionally include WHERE block
    const whereBlock = q === ""
      ? (await import("@neondatabase/serverless")).sql`` 
      : (await import("@neondatabase/serverless")).sql`
          WHERE ic.title ILIKE ${like}
             OR ic.brand ILIKE ${like}
             OR ic.category ILIKE ${like}
        `;

    // Note: COUNT(*)::int is handy for TS + JSON
    const { sql: _sql } = await import("@neondatabase/serverless");
    const rows = await sql/* Row */`
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
      ${whereBlock}
      GROUP BY ic.id
      ORDER BY price_cents NULLS LAST, ic.id DESC
      LIMIT 24
    `;

    return NextResponse.json({ ok: true, items: rows }, { status: 200 });
  } catch (err: any) {
    console.error("SEARCH_ERROR:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
