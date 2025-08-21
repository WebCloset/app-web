"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};



function formatPrice(cents: number | null) {
  if (cents == null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    cents / 100
  );
}

export default function SearchClient() {
  const [query, setQuery] = useState("levis");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(q: string) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run(query);
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items…"
          style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 14px", borderRadius: 8 }}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {err && <div style={{ color: "#c00", marginBottom: 16 }}>{err}</div>}

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
        }}
      >
        {items.map((it) => (
          <a key={it.id} href={`/item/${it.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <img
                src={it.image_url || "/placeholder.svg"}
                alt={it.title || ""}
                style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, background: "#f6f6f6" }}
              />
              <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>{it.brand || ""}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{it.title || ""}</div>
              <div style={{ fontSize: 13, color: "#555" }}>
                {formatPrice(it.price_cents)} • {it.listings_count ?? 0} listings
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
