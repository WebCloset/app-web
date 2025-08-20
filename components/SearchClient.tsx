"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count?: number | null;
};

function formatPrice(cents: number | null, currency = "USD") {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(cents / 100);
}

export default function SearchClient() {
  const [q, setQ] = useState<string>("levis");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        cache: "no-store"
      });
      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }
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
    runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(q);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brands, items, etc."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-black text-white"
          disabled={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && (
        <div className="mb-4 text-red-600 text-sm">Error: {error}</div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-gray-500">No results.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <Link key={it.id} href={`/item/${it.id}`} className="group">
            <div className="border rounded-2xl p-3 hover:shadow-md transition">
              <img
                src={it.image_url ?? "/placeholder.svg"}
                alt={it.title ?? "Item"}
                className="w-full h-48 object-cover rounded-lg mb-2"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="text-sm text-gray-500">
                {it.brand ?? "—"}
              </div>
              <div className="text-sm line-clamp-2">
                {it.title ?? "Untitled"}
              </div>
              <div className="mt-1 font-semibold">
                {formatPrice(it.price_cents)}
              </div>
              {it.listings_count != null && (
                <div className="text-xs text-gray-500">
                  {it.listings_count} listings
                </div>
              )}
              <div className="text-blue-600 text-sm mt-1 opacity-0 group-hover:opacity-100 transition">
                View details →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
