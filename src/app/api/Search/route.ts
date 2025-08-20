// app/api/search/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ItemRow = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  min_price_cents: number | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("q") || "").trim();
    const q = raw.slice(0, 80); // basic guard

    if (!q) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const like = `%${q}%`;

    const items = await sql<ItemRow[]>`
      SELECT id, brand, title, category, image_url, min_price_cents
      FROM item_canonical
      WHERE brand ILIKE ${like}
         OR title ILIKE ${like}
         OR category ILIKE ${like}
      ORDER BY last_seen DESC NULLS LAST
      LIMIT 24
    `;

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("search error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}