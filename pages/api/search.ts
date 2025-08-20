import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "../../lib/db";

type Row = {
  id: number;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number;
};

const text = `
WITH norm AS (
  SELECT
    ic.id,
    ic.brand,
    ic.title,
    ic.category,
    ic.image_url,
    MIN(il.price_cents) AS price_cents,
    COUNT(*) AS listings_count,
    regexp_replace(lower(ic.title),    '[^a-z0-9]', '', 'g') AS title_n,
    regexp_replace(lower(coalesce(ic.brand,'')),    '[^a-z0-9]', '', 'g') AS brand_n,
    regexp_replace(lower(coalesce(ic.category,'')), '[^a-z0-9]', '', 'g') AS category_n
  FROM item_canonical ic
  JOIN item_links  il ON il.canonical_id = ic.id AND il.active
  JOIN item_source s  ON s.id = il.source_id
  GROUP BY ic.id
)
SELECT id, brand, title, category, image_url, price_cents, listings_count
FROM norm
WHERE
  $1 = '' OR
  title_n    LIKE '%' || $2 || '%' OR
  brand_n    LIKE '%' || $2 || '%' OR
  category_n LIKE '%' || $2 || '%'
ORDER BY price_cents NULLS LAST, id DESC
LIMIT 24;
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (typeof req.query.q === "string" ? req.query.q : "").trim();
  const qNorm = q.toLowerCase().replace(/[^a-z0-9]/g, "");
  const rows = (await (sql as any)(text, [q, qNorm])) as Row[];
  res.status(200).json({ ok: true, items: rows });
}
