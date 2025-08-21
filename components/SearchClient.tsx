"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  brand: string | null;
  title: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};

function formatPrice(cents: number | null) {
  if (cents == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function SearchClient() {
  const [q, setQ] = useState<string>("levis");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run(q);
  }, []); // initial load

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Search items…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" disabled={loading} className="border rounded px-4 py-2">
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <a key={it.id} href={`/item/${it.id}`} className="border rounded p-4 hover:shadow">
            <img
              src={it.image_url || "/placeholder.svg"}
              alt={it.title || ""}
              className="w-full h-40 object-cover mb-3"
            />
            <div className="text-sm text-gray-600">{it.brand}</div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm">{formatPrice(it.price_cents)}</div>
            <div className="text-xs text-gray-500">{it.listings_count ?? 0} listings</div>
          </a>
        ))}
      </div>
    </div>
  );
}
