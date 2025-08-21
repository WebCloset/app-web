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
  listings_count: number | null;
};

function fmt(cents: number | null) {
  if (cents == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(q?: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q ?? query)}`, { cache: "no-store" });
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run("levis");
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" disabled={loading} className="border rounded px-4 py-2">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Link key={it.id} href={`/item/${it.id}`} className="border rounded p-4 hover:shadow">
            <img
              src={it.image_url || "/placeholder.svg"}
              alt={it.title || ""}
              className="w-full h-40 object-cover mb-3"
            />
            <div className="text-sm text-gray-600">{it.brand || ""}</div>
            <div className="font-semibold">{it.title || ""}</div>
            <div className="text-xs text-gray-500">
              {fmt(it.price_cents)} · {it.listings_count ?? 0} listings
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
