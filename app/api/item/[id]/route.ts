import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const rows = await sql`
    SELECT ic.id, ic.brand, ic.title, ic.category, ic.image_url,
           l.id AS link_id, s.price_cents, s.currency, s.seller_url, s.marketplace_code
    FROM item_canonical ic
    JOIN item_links l ON l.canonical_id = ic.id AND l.active
    JOIN item_source s ON s.id = l.source_id
    WHERE ic.id = ${id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const item = {
    id: rows[0].id,
    brand: rows[0].brand,
    title: rows[0].title,
    category: rows[0].category,
    image_url: rows[0].image_url,
  };

  const offers = rows.map((r: any) => ({
    link_id: r.link_id,
    price_cents: r.price_cents,
    currency: r.currency,
    seller_url: r.seller_url,
    marketplace: r.marketplace_code,
  }));

  return NextResponse.json({ item, offers });
}
