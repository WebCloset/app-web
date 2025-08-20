import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const item = await sql`
      SELECT id, brand, title, category, image_url, min_price_cents, first_seen, last_seen
      FROM item_canonical
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    if (item.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const offers = await sql`
      SELECT s.id, s.marketplace_code, s.condition, s.price_cents, s.currency,
             s.image_url, s.seller_url
      FROM item_links l
      JOIN item_source s ON s.id = l.source_id
      WHERE l.canonical_id = ${id}::uuid AND l.active
      ORDER BY s.price_cents ASC
    `;
    return NextResponse.json({ item: item[0], offers });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

